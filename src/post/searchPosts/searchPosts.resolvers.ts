import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const logicSearchPosts: Resolver = async(_,{keyword,cursorId},{client,loggedInUser}) => {

  const take = 10;

  // 얘는 로그인 안한 유저도 쓰니까
  const loggedInUserId = loggedInUser?.id;

  const posts = await client.post.findMany({
    where: {
      caption: {
        contains: keyword,
      },
      // 차단 유저 제외
      ...(loggedInUserId && {
        user: notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
      }),
    },
    orderBy: {
      // createdAt: "desc"
      id: "desc"
    },
    take,
    ...(cursorId && {cursor: {id:cursorId}, skip:1}),
  });

  const postsCount = posts.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = postsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = posts[postsCount-1].id;
    return {
      cursorId,
      hasNextPage: true,
      posts,
    };
  } else {
    return {
      hasNextPage: false,
      posts,
    };
  }
};

const searchPostsFn: Resolver = async(_,props,ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSearchPosts(_,props,ctx,null),
    "searchPosts"
  );
};

const resolver: Resolvers = {
  Query: {
    searchPosts: searchPostsFn,
  },
};

export default resolver;