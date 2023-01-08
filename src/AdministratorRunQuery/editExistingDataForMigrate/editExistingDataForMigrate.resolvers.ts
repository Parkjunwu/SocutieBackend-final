import { Resolver, Resolvers } from "../../types";

// 해시태그에 postOnHashTag 없는 애들을 지워
const editExistingDataForMigrateFn: Resolver = async(_,__,{client}) => {
  // await client.post.updateMany({
  //   data:{
  //     // firstPhoto
  //     isFirstVideo:false,
  //   }
  // });
  // const existing = await client.post.findMany({
  //   select:{
  //     id:true,
  //     file:true,
  //   },
  // });
  // await Promise.all(existing.map( async(exist) =>
  //   await client.post.update({
  //     where:{
  //       id:exist.id,
  //     },
  //     data:{
  //       firstPhoto:exist.file[0],
  //     },
  //   }),
  // ));
  return {ok: true}
}
const resolver: Resolvers = {
  Mutation: {
    editExistingDataForMigrate:editExistingDataForMigrateFn
  }
};

export default resolver;