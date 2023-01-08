import sendEmailAccuseInfoToOperator from "../../sendEmailAccuseInfoToOperator";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const accusePetLogFn:Resolver = async(_,{id,reason,detail},{loggedInUser,client}) => {
  const petLog = await client.petLog.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
    },
  });

  if(!petLog) {
    return { ok:false, error:"petLog not found" };
  }
  
  const alreadyAccused = await client.petLogAccused.findUnique({
    where: {
      petLogId_userId: {
        petLogId: id,
        userId: loggedInUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if(alreadyAccused){
    return { ok:true };
  }

  await client.petLogAccused.create({
    data: {
      PetLog: {
        connect: {
          id,
        },
      },
      userId: loggedInUser.id,
      reason,
      ...(detail && { detail }),
    },
  });

  const numberOfAccused = await client.petLogAccused.count({
    where:{
      petLogId:id,
    },
  });

  // 운영자에게 이메일 보냄
  sendEmailAccuseInfoToOperator("펫로그",id,numberOfAccused,reason,detail,loggedInUser.userName);

  return { ok:true };
};

const resolver: Resolvers = {
  Mutation: {
    accusePetLog: protectResolver(accusePetLogFn),
  },
};

export default resolver;