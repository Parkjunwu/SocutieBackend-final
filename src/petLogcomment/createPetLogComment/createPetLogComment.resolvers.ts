import { pushNotificationNotUploadPetLog } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import { getOffsetComments } from "../petLogCommentUtils";

const createPetLogCommentFn:Resolver = async(_,{petLogId,payload},{client,loggedInUser}) => {
  if(!payload) return {ok:false,error:"Please write your comment"};

  const okAndPetLogOwnerId = await client.petLog.findUnique({
    where:{
      id:petLogId,
    },
    select:{
      userId:true,
    },
  });

  if(!okAndPetLogOwnerId) return {ok:false,error:"No photo on there"};

  const newPetLogComment = await client.petLogComment.create({
    data:{
      payload,
      user:{
        connect:{
          id:loggedInUser.id,
        },
      },
      petLog:{
        connect:{
          id:petLogId,
        },
      },
    },
    select:{
      id:true,
      petLog:{
        select:{
          userId:true,
        },
      },
    },
  });

  const loggedInUserId = loggedInUser.id;
  const subscribeUserId = newPetLogComment.petLog.userId;
  const commentId = newPetLogComment.id;

  // 댓글 작성 후 notification, subscription
  // 댓글이 유저 본인꺼면 안보냄.
  if(loggedInUserId !== okAndPetLogOwnerId.userId) {
    await pushNotificationNotUploadPetLog(client, "MY_PETLOG_GET_COMMENT", loggedInUserId, subscribeUserId, {petLogId, commentId});
  }

  const totalCommentsNumber = await client.petLogComment.count({
    where:{
      petLogId,
    },
  });

  const offset = totalCommentsNumber - totalCommentsNumber%10;

  const offsetComments = await getOffsetComments(petLogId,loggedInUserId,offset);

  // return { ok:true, id:newPetLogComment.id };
  return { ok:true, totalCommentsNumber, offsetComments };
};

const resolver:Resolvers = {
  Mutation:{
    createPetLogComment:protectResolver(createPetLogCommentFn),
  },
};

export default resolver;