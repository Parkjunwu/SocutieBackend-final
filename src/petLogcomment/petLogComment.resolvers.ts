import { Resolver, Resolvers } from "../types"

// userId 가 typeDefs 에 없는데 받아지네?!
const isMineFn:Resolver = ({userId},_,{loggedInUser}) => userId===loggedInUser?.id

const totalLikesFn:Resolver = ({id},_,{client}) => client.petLogCommentLike.count({
  where:{
    petLogCommentId:id
  }
});

const totalCommentOfCommentsFn:Resolver = ({id},_,{client}) => client.petLogCommentOfComment.count({
  where:{
    petLogCommentId:id
  },
});

const isLikedFn:Resolver = async({id},_,{client,loggedInUser}) => {
  if(!loggedInUser) return null;
  const result = await client.petLogCommentLike.findFirst({
    where:{
      petLogCommentId:id,
      userId:loggedInUser.id
    },
    select:{
      id:true,
    },
  });
  return Boolean(result);
}

const resolver:Resolvers = {
  PetLogComment:{
    isMine:isMineFn,
    totalLikes:totalLikesFn,
    totalCommentOfComments:totalCommentOfCommentsFn,
    isLiked:isLikedFn
  }
}

export default resolver;