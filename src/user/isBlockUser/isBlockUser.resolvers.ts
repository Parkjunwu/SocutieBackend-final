import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const isBlockUserFn:Resolver = async(_, { id }, { loggedInUser, client }) => {
  const isBlock = await client.user.findFirst({
    where:{
      id:loggedInUser.id,
      blockUsers:{
        some:{
          id
        }
      }
    },
  });
  return Boolean(isBlock);
}

const resolver:Resolvers = {
  Query: {
    isBlockUser:protectResolver(isBlockUserFn)
  }
};

export default resolver;