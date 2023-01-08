import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const toggleCommentLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {

  // 코멘트 있는지.
  const comment = await client.comment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      post:{
        select:{
          id:true,
          bestCommentId:true,
          bestCommentLikes:true,
        },
      },
    },
  });

  if(!comment) return { ok:false, error:"comment not found" };

  const likeWhere = {
    commentId_userId: {
      commentId: id,
      userId: loggedInUser.id,
    },
  };

  const ifUserAlreadyLike = await client.commentLike.findUnique({
    where: likeWhere,
    select: {
      id: true,
    },
  });

  const post = comment.post;
  const postId = post.id;
  const postBestCommentId = post.bestCommentId;
  const postBestCommentLikes = post.bestCommentLikes;
  const commentId = id;

  // 이미 좋아요 한 경우
  if (ifUserAlreadyLike) {

    await client.commentLike.delete({
      where: likeWhere,
    });

    // 현재 코멘트가 베댓인 경우
    if(postBestCommentId === commentId){
      await client.post.update({
        where: {
          id: postId,
        },
        data: {
          bestCommentLikes: postBestCommentLikes - 1,
        },
      });
    }

  } else {
    const result = await client.commentLike.create({
      data: {
        userId: loggedInUser.id,
        commentId: id,
        // user: {
        //   connect: {
        //     id: loggedInUser.id
        //   }
        // },
        // comment: {
        //   connect: {
        //     id
        //     // id: comment.id
        //   }
        // }
      },
      select: {
        comment: {
          select: {
            userId: true,
          },
        },
      },
    });


    // 현재 코멘트가 베댓인 경우
    if(postBestCommentId === commentId){

      await client.post.update({
        where: {
          id: postId,
        },
        data: {
          bestCommentLikes: postBestCommentLikes + 1,
        },
      });

    // 현재 코멘트가 베댓이 아닌 경우
    } else {
      // 이렇게 하거나 아니면 commentLikes 를 인자로 받거나. 근데 그러면 사용자 많아지면 안맞아질 수 있겠군
      const thisCommentLikes = await client.commentLike.count({
        where: {
          commentId: id,
        },
      });

      // 지금 코멘트의 좋아요가 더 많으면 베댓으로 만들어
      if(thisCommentLikes > postBestCommentLikes) {
        await client.post.update({
          where: {
            id: postId,
          },
          data: {
            bestCommentId: commentId,
            bestCommentLikes: thisCommentLikes,
          },
        });
      }
    }

    const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.comment.userId;

    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(loggedInUserId !== subscribeUserId) {
      await pushNotificationNotUploadPost(client, "MY_COMMENT_GET_LIKE", loggedInUserId, subscribeUserId, {postId, commentId});
    }

  };
  
  return { ok:true };
};

const resolver: Resolvers = {
  Mutation: {
    toggleCommentLike: protectResolver(toggleCommentLikeFn),
  },
};

export default resolver;