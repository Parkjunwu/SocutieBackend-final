import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editPetLogCommentFn: Resolver = async(_,{id,payload},{client,loggedInUser}) => {
  const petLogComment = await client.petLogComment.findUnique({
    where:{
      id,
    },
    select:{
      userId:true,
    },
  });

  if (!petLogComment) {
    return {ok:false, error:"comment not found"};
  } else if (petLogComment.userId !== loggedInUser.id) {
    return {ok:false, error:"Not authorized"};
  }

  await client.petLogComment.update({
    where:{
      id
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
    editPetLogComment:protectResolver(editPetLogCommentFn),
  },
};

export default resolver;