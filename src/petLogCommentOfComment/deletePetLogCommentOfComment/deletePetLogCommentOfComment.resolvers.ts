import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deletePetLogCommentOfCommentFn:Resolver = async(_,{id},{loggedInUser,client}) => {
  const petLogCommentOfComment = await client.petLogCommentOfComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if(!petLogCommentOfComment) {
    return { ok:false, error:"commentOfComment not found" };
  } else if (petLogCommentOfComment.userId !== loggedInUser.id) {
    return { ok:false, error:"Not authorized" };
  }

  await client.petLogCommentOfComment.delete({
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
    deletePetLogCommentOfComment:protectResolver(deletePetLogCommentOfCommentFn),
  },
};

export default resolver;