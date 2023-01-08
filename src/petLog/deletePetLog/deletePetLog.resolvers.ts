import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deletePetLogFn:Resolver = async(_,{id},{loggedInUser,client}) => {
  const petLog = await client.petLog.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if(!petLog) {
    return { ok:false, error:"petLog not found"};
  } else if (petLog.userId !== loggedInUser.id) {
    console.error("deletePetLog // 자기꺼 아닌 게시물 삭제 시도. 해킹 가능성 있음.");
    return { ok:false, error:"Not authorized" };
  }

  await client.petLog.delete({
    where:{
      id,
    },
  });

  return { ok: true };
};

const resolver:Resolvers = {
  Mutation: {
    deletePetLog:protectResolver(deletePetLogFn),
  },
};

export default resolver;