import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../user.utils";

const logicSearchUsers: Resolver = async (_,{keyword, cursorId},{client,loggedInUser}) => {

  // 한번에 가져올 갯수 take 로 변경
  const take = 10;

  // 얘는 로그인 안한 유저도 쓰니까
  const loggedInUserId = loggedInUser?.id;

  const users = await client.user.findMany({
    where: {
      userName: {
        // 지금은 이름 시작이 같은 애들만 찾음
        startsWith: keyword.toLowerCase(),
      },
      // 차단 유저 제외
      ...(loggedInUserId && notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId)),
    },
    select:{
      id:true,
      userName:true,
      avatar:true,
    },
    take,
    ...(cursorId && {
      skip: 1,
      cursor: {
        id: cursorId,
      },
    }),
  });


  const usersCount = users.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = usersCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = users[usersCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      users,
    };
  } else {
    return {
      hasNextPage:false,
      users,
    };
  }
};

const searchUsersFn: Resolver = async(_,props,ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSearchUsers(_,props,ctx,null),
    "searchPosts"
  );
};

const resolver: Resolvers = {
  Query: {
    searchUsers: searchUsersFn,
  },
};

export default resolver;
