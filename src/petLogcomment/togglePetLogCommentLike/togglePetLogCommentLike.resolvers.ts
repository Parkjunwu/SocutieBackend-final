import { pushNotificationNotUploadPetLog } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const togglePetLogCommentLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  // 코멘트 있는지.
  const petLogComment = await client.petLogComment.findUnique({
    where:{
      id
    },
    select:{
      id:true,
    },
  });

  if(!petLogComment) return {ok:false,error:"comment not found"};

  const likeWhere = {
    petLogCommentId_userId:{
      petLogCommentId:id,
      userId:loggedInUser.id,
    },
  };

  const like = await client.petLogCommentLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });

  if(like) {
    await client.petLogCommentLike.delete({
      where:likeWhere,
    });
  } else {
    const result = await client.petLogCommentLike.create({
      data:{
        userId:loggedInUser.id,
        petLogCommentId:id,
        // user:{
        //   connect:{
        //     id:loggedInUser.id
        //   }
        // },
        // comment:{
        //   connect:{
        //     id
        //     // id:comment.id
        //   }
        // }
      },
      select:{
        petLogComment:{
          select:{
            userId:true,
            petLogId:true,
          },
        },
      },
    });

    const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.petLogComment.userId;
    const petLogId = result.petLogComment.petLogId;
    const commentId = id;

    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(loggedInUserId !== subscribeUserId) {
      await pushNotificationNotUploadPetLog(client, "MY_PETLOG_COMMENT_GET_LIKE", loggedInUserId, subscribeUserId, {petLogId, commentId});
    }
  }
  
  return { ok:true };
};

const resolver:Resolvers = {
  Mutation:{
    togglePetLogCommentLike:protectResolver(togglePetLogCommentLikeFn),
  },
};

export default resolver;