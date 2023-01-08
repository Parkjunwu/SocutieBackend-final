import { pushNotificationNotUploadPetLog } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const createPetLogCommentOfCommentFn:Resolver = async(_,{petLogCommentId,payload},{client,loggedInUser}) => {
  if(!payload) return { ok:false,error:"Please write your comment" };

  const okAndPetLogOwnerId = await client.petLogComment.findUnique({
    where:{
      id:petLogCommentId,
    },
    select:{
      userId:true,
    },
  });

  if(!okAndPetLogOwnerId) return {ok:false,error:"No petLog is searched"};

  const newPetLogCommentOfComment = await client.petLogCommentOfComment.create({
    data:{
      payload,
      user:{
        connect:{
          id:loggedInUser.id,
        },
      },
      petLogComment:{
        connect:{
          id:petLogCommentId,
        },
      },
    },
    select:{
      id:true,
      petLogComment:{
        select:{
          userId:true,
          petLogId:true,
        },
      },
    },
  });

  const loggedInUserId = loggedInUser.id;
  const subscribeUserId = newPetLogCommentOfComment.petLogComment.userId;
  const petLogId = newPetLogCommentOfComment.petLogComment.petLogId;
  const commentOfCommentId = newPetLogCommentOfComment.id;

  // 댓글 작성 후 notification, subscription
  // 댓글이 유저 본인꺼면 안보냄.
  if(loggedInUserId !== okAndPetLogOwnerId.userId) {
    await pushNotificationNotUploadPetLog(client, "MY_PETLOG_COMMENT_GET_COMMENT", loggedInUserId, subscribeUserId, {petLogId, commentId:petLogCommentId, commentOfCommentId});
  }

  return { ok:true, id:newPetLogCommentOfComment.id };
};

const resolver:Resolvers = {
  Mutation:{
    createPetLogCommentOfComment:protectResolver(createPetLogCommentOfCommentFn),
  },
};

export default resolver;