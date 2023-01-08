import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const logicSearchPetLogs: Resolver = async(_,{keyword,cursorId},{client,loggedInUser}) => {

  const take = 10;

  // 얘는 로그인 안한 유저도 쓰니까
  const loggedInUserId = loggedInUser?.id;

  const petLogs = await client.petLog.findMany({
    where: {
      // title 로 찾음
      title: {
        contains: keyword,
      },
      // 차단 유저 제외
      ...(loggedInUserId && {
        user: notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
      }),
    },
    select:{
      id:true,
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      },
      title:true,
      createdAt:true,
      thumbNail:true,
    },
    orderBy: {
      // createdAt: "desc"
      id: "desc",
    },
    take,
    ...(cursorId && {cursor: {id:cursorId}, skip:1}),
  });

  const petLogsCount = petLogs.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = petLogsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = petLogs[petLogsCount-1].id;
    return {
      cursorId,
      hasNextPage: true,
      petLogs,
    };
  } else {
    return {
      hasNextPage: false,
      petLogs,
    };
  }
};

const searchPetLogsFn: Resolver = async(_,props,ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSearchPetLogs(_,props,ctx,null),
    "searchPetLogs"
  );
};

const resolver: Resolvers = {
  Query: {
    searchPetLogs: searchPetLogsFn,
  },
};

export default resolver;