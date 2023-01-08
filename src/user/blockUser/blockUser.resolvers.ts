
import { findRoomId } from "../../message/message.utils";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

// 아직 차단했다고 뭐를 막는건 구현 안했음. 글고 지금은 id 만 넣고 relation 으로 구현 안함.
const blockUserFn: Resolver = async(_,{id}:{id:number},{client,loggedInUser}) => {
  // 유저 존재 하는지
  const isUser = await client.user.findUnique({
    where:{
      id
    },
    // 지금은 관계라서 받아질랑가
    select:{
      id:true,
      blockedUsers:true,
    },
  });
  
  // 해당 id 유저가 없을 때.
  if(!isUser) {
    return {ok:false, error:"해당 유저가 존재하지 않습니다."}
  }
  
  // 이미 있으면 그냥 ok 반환.
  if(isUser.blockedUsers.some(user=>user.id === loggedInUser.id)) {
    return {ok:true};
  }
  // 차단 목록에 넣음.
  await client.user.update({
    where:{
      id:loggedInUser.id
    },
    data:{
      blockUsers:{
        connect:{
          id
        }
      }
    },
    select:{
      id:true,
    }
  });

  // 채팅방 있으면 안받도록
  const ifHaveRoomThenReturnRoomId = await findRoomId(loggedInUser.id,id);

  // 이전에 안읽은 메세지 갯수
  let beforeUnreadTotal:number;
  
  if(ifHaveRoomThenReturnRoomId){
    beforeUnreadTotal = await client.message.count({
      where:{
        roomId:ifHaveRoomThenReturnRoomId.id,
        user:{
          id:{
            not:loggedInUser.id
          }
        },
        read:false
      }
    });
  } else {
    beforeUnreadTotal = 0;
  }

  if(ifHaveRoomThenReturnRoomId) {
    await client.userOnRoom.update({
      where:{
        userId_roomId:{
          userId:loggedInUser.id,
          roomId:ifHaveRoomThenReturnRoomId.id
        }
      },
      data:{
        isBlockOpponent:true,
        blockTime:new Date()
      },
    });
  }

  return { ok:true, beforeUnreadTotal };
};

const resolver:Resolvers = {
  Mutation: {
    blockUser:protectResolver(blockUserFn),
  },
};

export default resolver;