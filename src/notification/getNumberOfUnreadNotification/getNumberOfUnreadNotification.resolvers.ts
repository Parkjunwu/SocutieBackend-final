import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

// cursor 도 만들어야 할듯
const getNumberOfUnreadNotificationFn:Resolver = async(_,__,{client,loggedInUser}) => {
  const result = await client.notification.count({
    // publishUser 계산 없는데 상관 없는지 확인 필요
    where:{
      subscribeUserId:loggedInUser.id,
      read:false,
    },
  });
  console.log("getNumberOfUnreadNotification")
  console.log(result)
  return result;
}
const resolver:Resolvers = {
  Query: {
    getNumberOfUnreadNotification:protectResolver(getNumberOfUnreadNotificationFn)
  }
};

export default resolver;