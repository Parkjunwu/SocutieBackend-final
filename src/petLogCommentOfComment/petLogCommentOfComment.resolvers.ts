import { Resolver, Resolvers } from "../types"

const isMineFn:Resolver = ({userId},_,{loggedInUser}) => userId === loggedInUser?.id;

const totalLikesFn:Resolver = ({id},_,{client}) => client.petLogCommentOfCommentLike.count({
  where:{
    petLogCommentOfCommentId:id,
  },
});

const isLikedFn:Resolver = async({id},_,{client,loggedInUser}) => {
  if(!loggedInUser) return null;
  const result = await client.petLogCommentOfCommentLike.findFirst({
    where:{
      petLogCommentOfCommentId:id,
      userId:loggedInUser.id
    },
    select:{
      id:true,
    },
  });
  return Boolean(result);
};

const resolver:Resolvers = {
  PetLogCommentOfComment:{
    isMine:isMineFn,
    totalLikes:totalLikesFn,
    isLiked:isLikedFn,
  },
};

export default resolver;