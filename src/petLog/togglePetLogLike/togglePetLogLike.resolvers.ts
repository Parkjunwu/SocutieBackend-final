import { pushNotificationNotUploadPetLog } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const togglePetLogLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  const petLog = await client.petLog.findUnique({
    where:{
      id
    },
    select:{
      id:true,
    },
  });
  if(!petLog) return {ok:false,error:"petLog not found"}
  const likeWhere = {
    petLogId_userId:{
      petLogId:id,
      userId:loggedInUser.id
    }
  };
  const like = await client.petLogLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });
  if(like) {
    await client.petLogLike.delete({where:likeWhere});
  } else {
    const result = await client.petLogLike.create({
      data:{
        userId:loggedInUser.id,
        petLogId:id
        // user:{
        //   connect:{
        //     id:loggedInUser.id
        //   }
        // },
        // petLog:{
        //   connect:{
        //     id
        //     // id:petLog.id
        //   }
        // }
      },
      select:{
        petLog:{
          select:{
            userId:true,
            id:true,
          }
        }
      }
    });

    // subscription, push notification 은 일단 나중에

    const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.petLog.userId;
    const petLogId = id;
    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(loggedInUserId !== subscribeUserId) {
      await pushNotificationNotUploadPetLog(client, "MY_PETLOG_GET_LIKE", loggedInUser.id, subscribeUserId, { petLogId });
    }
  }

  return { ok:true };
}

const resolver:Resolvers = {
  Mutation:{
    togglePetLogLike:protectResolver(togglePetLogLikeFn)
  }
}
export default resolver