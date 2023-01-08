import { Resolver, Resolvers } from "../../types";

// 일단 쓰진 않음. 걍 push noti 에서 commentId 받아서 seeComments로 받음.

const getNotifiedPetLogCommentFn: Resolver = async(_,{petLogCommentId,petLogId},{client,}) => {
  // const petLogComment = await client.petLogComment.findUnique({
  //   where: {
  //     id: petLogCommentId
  //   },
  //   include: {
  //     user: {
  //       select: {
  //         id: true,
  //         userName: true,
  //         avatar: true,
  //       }
  //     }
  //   }
  // });
  const petLogComment = await client.petLogComment.findUnique({
    where: {
      id: petLogCommentId,
    },
    select: {
      id: true,
    },
  });

  if(!petLogComment) {
    return { error:  "해당 댓글이 존재하지 않습니다." };
  }

  const totalComments = await client.petLogComment.count({
    where: {
      petLogId,
    },
  });

  const beforeComments = await client.petLogComment.count({
    where: {
      petLogId,
      // createAt 말고 id 가 작은 걸로 함.
      id: {
        lt: petLogCommentId,
      },
    },
  });

  const offset = beforeComments - beforeComments%10;

  return { totalComments,offset };
  //  else {
  //   return { petLogComment };
  // }
};

const resolver: Resolvers = {
  Query: {
    getNotifiedPetLogComment: getNotifiedPetLogCommentFn,
  },
};

export default resolver;