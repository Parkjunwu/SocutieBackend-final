import { pushNotificationNotUploadPetLog } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const togglePetLogCommentOfCommentLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  // 코멘트 있는지.
  const petLogCommentOfComment = await client.petLogCommentOfComment.findUnique({
    where:{
      id
    },
    select:{
      id:true,
    },
  });

  if(!petLogCommentOfComment) return {ok:false,error:"commentOfComment not found"};
  
  const likeWhere = {
    petLogCommentOfCommentId_userId:{
      petLogCommentOfCommentId:id,
      userId:loggedInUser.id,
    },
  };

  const like = await client.petLogCommentOfCommentLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });

  if(like) {
    await client.petLogCommentOfCommentLike.delete({where:likeWhere});
  } else {
    const result = await client.petLogCommentOfCommentLike.create({
      data:{
        userId:loggedInUser.id,
        petLogCommentOfCommentId:id,
      },
      select:{
        petLogCommentOfComment:{
          select:{
            userId:true,
            petLogComment:{
              select:{
                petLogId:true,
              },
            },
            petLogCommentId:true,
          },
        },
      },
    });

    const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.petLogCommentOfComment.userId;
    const petLogId = result.petLogCommentOfComment.petLogComment.petLogId;
    const commentId = result.petLogCommentOfComment.petLogCommentId;
    const commentOfCommentId = id;

    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(loggedInUserId !== subscribeUserId) {
      await pushNotificationNotUploadPetLog(client, "MY_PETLOG_COMMENT_OF_COMMENT_GET_LIKE", loggedInUserId, subscribeUserId,{petLogId, commentId, commentOfCommentId});
    }
  };

  
  return { ok:true };
};

const resolver:Resolvers = {
  Mutation:{
    togglePetLogCommentOfCommentLike:protectResolver(togglePetLogCommentOfCommentLikeFn),
  },
};

export default resolver;