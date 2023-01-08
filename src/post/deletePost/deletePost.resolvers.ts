import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deletePostFn:Resolver = async(_,{id},{loggedInUser,client}) => {
  const post = await client.post.findUnique({
    where:{
      id
    },
    select:{
      userId:true
    }
  });

  if(!post) {
    return { ok:false, error:"post not found"};
  } else if (post.userId !== loggedInUser.id) {
    console.error("deletePost // 자기꺼 아닌 게시물 삭제 시도. 해킹 가능성 있음.");
    return { ok:false, error:"Not authorized" };
  }

  await client.post.delete({
    where:{
      id,
    },
  });

  return { ok:true };
};

const resolver:Resolvers = {
  Mutation: {
    deletePost:protectResolver(deletePostFn),
  },
};

export default resolver;