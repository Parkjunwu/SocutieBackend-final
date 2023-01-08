import { Resolver, Resolvers } from "../../types";

// 일단 쓰진 않음. 걍 push noti 에서 commentId 받아서 seeComments로 받음.

const getNotifiedCommentFn:Resolver = async(_,{commentId},{client,}) => {
  const comment = await client.comment.findUnique({
    where:{
      id:commentId
    },
    include:{
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      }
    }
  });

  if(!comment) {
    return { error: "해당 댓글이 존재하지 않습니다." };
  } else {
    return { comment };
  }
};

const resolver:Resolvers = {
  Query: {
    getNotifiedComment:getNotifiedCommentFn,
  },
};

export default resolver;