import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId, protectResolver } from "../../user/user.utils";

const seeFollowersFeedFn:Resolver = async(_,{offset},{client,loggedInUser}) => {
  // 한번에 가져올 포스트 갯수
  const take = 5;

  const loggedInUserId = loggedInUser.id;
  
  const result = await client.post.findMany({
    where: {
      OR: [
        {
          user: {
            followers: {
              some: {
                id: loggedInUserId,
              },
            },
            // 차단 유저 제외
            ...notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
          },
          // 신고 게시물 제외? 확인 필요. + 신고 몇개 이상 게시물도 안보이게
          accused: {
            none: {
              userId: loggedInUserId,
            },
          },
        },
        // 본인 것도 가져오는데.. 그럴 필요가 있나?
        {
          userId: loggedInUser.id,
        },
      ]
    },
    orderBy: {
      // createdAt: "desc",
      id: "desc",
    },
    take,
    skip: offset,
  });
  
  return result;
};


const resolver: Resolvers = {
  Query: {
    seeFollowersFeed: protectResolver(seeFollowersFeedFn),
  },
};

export default resolver;