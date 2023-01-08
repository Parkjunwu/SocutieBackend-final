import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import pubSubReadMessageNeedRoomIdAndUserId from "../readMessagePubSub";

const readAllMessageFn: Resolver = async(_,{roomId},{client,loggedInUser}) =>{
  try {
    const room = await client.room.findFirst({
      where:{
        id:roomId,
        UserOnRoom:{
          some:{
            userId:loggedInUser.id
          }
        }
      },
      select:{
        id:true
      }
    });

    if(!room) return {ok:false, error:"room not found"};

    const result = await client.message.updateMany({
      where:{
        roomId,
        read:false,
      },
      data:{
        read:true,
      },
    });

    const numberOfRead = result.count;
    const userId = loggedInUser.id;
    await pubSubReadMessageNeedRoomIdAndUserId(roomId,userId);

    return { ok:true, numberOfRead };

  } catch (e) {
    console.log("readAllMessage 에러 : "+e);
    return { ok:false, error:"메세지 읽기에 실패하였습니다." };
  }
};
// 둘만 있으니까 이렇게 안해도 되겠네.
// client.message.updateMany({
//   where:{
//     roomId:id,
//     userId:{
//       not:loggedInUser.id
//     },
//     read:false
//   },
//   data:{
//     read:true
//   }
// })

const resolver:Resolvers = {
  Mutation: {
    readAllMessage:protectResolver(readAllMessageFn)
  }
}
export default resolver;