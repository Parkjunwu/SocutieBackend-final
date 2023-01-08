// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const createCommentFn: Resolver = async(_,{postId,payload},{client,loggedInUser}) => {

  if(!payload) return { ok:false, error:"Please write your comment" };

  const okAndPostOwnerIdAndLikes = await client.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      userId: true,
      bestCommentLikes: true,
    },
  });

  if(!okAndPostOwnerIdAndLikes) return { ok:false, error:"No photo on there" };

  const newComment = await client.comment.create({
    data: {
      payload,
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
    select: {
      id: true,
      post: {
        select: {
          userId: true,
        },
      },
    },
  });

  const loggedInUserId = loggedInUser.id;
  const subscribeUserId = newComment.post.userId;
  const commentId = newComment.id;

  // 0 일 수도 있으니까 null 인지로 확인. 댓글이 없으니 배뎃에 얘를 바로 넣겠다는 뜻
  if(okAndPostOwnerIdAndLikes.bestCommentLikes === null) {
    await client.post.update({
      where: {
        id: postId,
      },
      data: {
        bestCommentId: commentId,
        bestCommentLikes: 0,
      },
    });
  }

  // 댓글 작성 후 notification, subscription
  // 댓글이 유저 본인꺼면 안보냄.
  if(loggedInUserId !== okAndPostOwnerIdAndLikes.userId) {
    await pushNotificationNotUploadPost(client, "MY_POST_GET_COMMENT", loggedInUserId, subscribeUserId, {postId, commentId});
  }

  return { ok:true, id:newComment.id };
};

const resolver: Resolvers = {
  Mutation: {
    createComment: protectResolver(createCommentFn),
  },
};

export default resolver;