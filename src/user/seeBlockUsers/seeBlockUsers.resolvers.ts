import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const logicSeeBlockUsers: Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  
  const take = 30;

  const getBlockUsers = await client.user.findUnique({
    where: {
      id: loggedInUser.id
    },
    select: {
      blockUsers: {
        select: {
          id: true,
          userName: true,
          avatar: true,
        },
        take,
        ...(cursorId && {
          skip: 1,
          cursor: {
            id: cursorId
          },
        }),
      }
    },
  });

  const blockUsers = getBlockUsers.blockUsers;
  const blockUsersCount = blockUsers.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = blockUsersCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = blockUsers[blockUsersCount-1].id;
    return {
      cursorId,
      hasNextPage: true,
      users: blockUsers,
    };
  } else {
    return {
      hasNextPage: false,
      users: blockUsers,
    };
  }
};

const seeBlockUsersFn: Resolver = async (_,props,ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeBlockUsers(_,props,ctx,null),
    "seeBlockUsers"
  );
};

const resolver: Resolvers = {
  Query: {
    seeBlockUsers: protectResolver(seeBlockUsersFn),
  },
};

export default resolver;
