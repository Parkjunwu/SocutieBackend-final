import { Resolver, Resolvers } from "../../types";

const seePostFn:Resolver = async(_,{id},{client,}) => {

  // 얘도 차단 걸러야 하나?
  const result = await client.post.findUnique({
    where: {
      id,
    },
  });
  
  return result;
};

const resolver: Resolvers = {
  Query: {
    seePost: seePostFn,
  },
};

export default resolver;