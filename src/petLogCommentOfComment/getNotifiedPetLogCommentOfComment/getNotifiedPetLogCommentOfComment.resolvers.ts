import { Resolver, Resolvers } from "../../types";

const getNotifiedPetLogCommentOfCommentFn: Resolver = async(_,{petLogCommentOfCommentId},{client,}) => {
  const petLogCommentOfComment = await client.petLogCommentOfComment.findUnique({
    where: {
      id: petLogCommentOfCommentId,
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          avatar: true,
        },
      },
    },
  });

  if(!petLogCommentOfComment) {
    return { error: "해당 댓글이 존재하지 않습니다." };
  } else {
    return { petLogCommentOfComment };
  }
};

const resolver: Resolvers = {
  Query: {
    getNotifiedPetLogCommentOfComment:getNotifiedPetLogCommentOfCommentFn,
  },
};

export default resolver;