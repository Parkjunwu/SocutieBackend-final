import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deletePetLogCommentFn:Resolver = async(_,{id},{loggedInUser,client}) => {
  const petLogComment = await client.petLogComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if(!petLogComment) {
    return { ok:false, error:"comment not found"};
  } else if (petLogComment.userId !== loggedInUser.id) {
    return { ok:false, error:"Not authorized"};
  }

  await client.petLogComment.delete({
    where:{
      id,
    },
    select:{
      id:true,
    },
  });

  return {ok:true};
};

const resolver:Resolvers = {
  Mutation: {
    deletePetLogComment:protectResolver(deletePetLogCommentFn),
  },
};

export default resolver;