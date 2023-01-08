import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const seeNewPostFeedFn:Resolver = async(_,{offset},{client,loggedInUser}) => {
  // 한번에 가져올 포스트 갯수
  const take = 5;

  const loggedInUserId = loggedInUser?.id;

  const posts = await client.post.findMany({
    // 로그인한 유저인 경우 차단 유저 제외
    ...(loggedInUserId && {
      where: {
        user: notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
        // 신고 게시물 제외? 확인 필요. + 신고 몇개 이상 게시물도 안보이게
        accused: {
          none: {
            userId: loggedInUserId,
          },
        },
      },
    }),
    orderBy: {
      // createdAt: "desc"
      id: "desc",
    },
    take,
    skip: offset,
  });

  return posts;
};

const resolver: Resolvers = {
  Query: {
    seeNewPostFeed: seeNewPostFeedFn,
  },
};

export default resolver;