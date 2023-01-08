import sendEmailAccuseInfoToOperator from "../../sendEmailAccuseInfoToOperator";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const accusePostFn:Resolver = async(_,{id,reason,detail},{loggedInUser,client}) => {
  const post = await client.post.findUnique({
    where: {
      id
    },
    select: {
      userId:true,
    },
  });

  if(!post) {
    return { ok:false, error:"post not found"};
  }
  
  const alreadyAccused = await client.postAccused.findUnique({
    where: {
      postId_userId: {
        postId:id,
        userId:loggedInUser.id,
      },
    },
    select:{
      id:true
    },
  });

  if(alreadyAccused){
    return { ok:true };
  }

  await client.postAccused.create({
    data:{
      Post:{
        connect:{
          id
        }
      },
      userId: loggedInUser.id,
      reason,
      ...(detail && { detail }),
    },
  });

  const numberOfAccused = await client.postAccused.count({
    where:{
      postId:id,
    },
  });

  // 운영자에게 이메일 보냄
  sendEmailAccuseInfoToOperator("포스팅",id,numberOfAccused,reason,detail,loggedInUser.userName);

  return { ok:true };
};

const resolver: Resolvers = {
  Mutation: {
    accusePost: protectResolver(accusePostFn),
  },
};

export default resolver;