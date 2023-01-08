import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const logicSeeCommentOfCommentLikes: Resolver = async(_,{commentOfCommentId,cursorId},{client,loggedInUser}) => {

  const take = 20;

  const loggedInUserId = loggedInUser?.id;

  const likeUsers = await client.user.findMany({
    where: {
      commentOfCommentLikes: {
        some: {
          commentOfCommentId,
        },
      },
      // 로그인한 유저인 경우 차단 유저 제외
      ...(loggedInUserId && notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId)),
    },
    take,
    ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
    select: {
      id: true,
      userName: true,
      avatar: true,
    },
  });

  const likeUsersCount = likeUsers.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = likeUsersCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = likeUsers[likeUsersCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      likeUsers,
    };
  } else {
    return {
      hasNextPage:false,
      likeUsers,
    };
  }
};

const seeCommentOfCommentLikesFn: Resolver = async(_,props,ctx) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeCommentOfCommentLikes(_,props,ctx,null),
    "seeCommentOfCommentLikes"
  );
};

const resolver: Resolvers = {
  Query: {
    seeCommentOfCommentLikes: seeCommentOfCommentLikesFn,
  },
};

export default resolver;