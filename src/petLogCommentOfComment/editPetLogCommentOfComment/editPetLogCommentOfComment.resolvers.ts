import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editPetLogCommentOfCommentFn: Resolver = async(_,{id,payload},{client,loggedInUser}) => {
  const petLogCommentOfComment = await client.petLogCommentOfComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if (!petLogCommentOfComment) {
    return { ok:false, error:"commentOfComment not found" };
  } else if (petLogCommentOfComment.userId !== loggedInUser.id) {
    return { ok:false, error:"Not authorized" };
  }

  await client.petLogCommentOfComment.update({
    where:{
      id,
    },
    data:{
      payload,
    },
    select:{
      id:true,
    },
  });

  return {ok:true};
};

const resolver:Resolvers = {
  Mutation :{
    editPetLogCommentOfComment:protectResolver(editPetLogCommentOfCommentFn),
  },
};

export default resolver;