import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicGetUserPetLogs: Resolver = async(_,{userId,cursorId},{client}) => {
  console.log("getUserPetLogs")
  const take = 30;
  
  const petLogs = await client.petLog.findMany({
    where:{
      userId
    },
    orderBy:{
      // createdAt:"desc"
      id: "desc",
    },
    take,
    ...(cursorId && { skip:1 , cursor: { id: cursorId } }),
    select:{
      id:true,
      title:true,
      thumbNail:true,
      createdAt:true,
      // 이게 있어야 될라나?
      // userId:true,
    },
  });
  
  const petLogsCount = petLogs.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = petLogsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = petLogs[petLogsCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      petLogs,
    };
  } else {
    return {
      hasNextPage:false,
      petLogs,
    };
  }
};

const resolver:Resolvers = {
  Query: {
    getUserPetLogs: async(_, props, ctx) => {
      return paginationErrorCheckNeedLogicAndQueryName(
        await logicGetUserPetLogs(_,props,ctx,null),
        "getUserPetLogs"
      );
    },
  },
};

export default resolver;