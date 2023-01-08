
import { sendSinglePushNotification } from "../../fcmAppNotification";
import { channel } from "../../getChannel";
import pubsub, { GET_MESSAGE, NEW_MESSAGE } from "../../pubsub";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import { findRoomId } from "../message.utils";


const sendMessageFn: Resolver = async(_,{payload,userId,roomId},{client,loggedInUser}) => {
  // userId 랑 roomId 가 둘다 없거나 둘다 있는 쿼리가 들어올 수 없는데 들어옴. 뭔가 이상한거.
  const queryIsWeird = (!userId && !roomId) || (userId && roomId);
  if(queryIsWeird) {
    console.error("sendMessage // userId 랑 roomId 가 둘 다 있거나 없는 이상한 쿼리를 날림. 해킹 가능성 있음.")
    return {ok:false, error:"There is nothing."}
  }
  // 자기 자신만의 방을 만듦. 얘도 이상한거
  if(userId === loggedInUser.id) {
    console.error("sendMessage // 자기 자신의 방을 만드는 이상한 쿼리를 날림. 해킹 가능성 있음.")
    return {ok:false, error:"Cannot create room"}
  }
  
  let room = null;
  // push 알림을 위한 deviceToken.
  let receiversDeviceToken;
  let isReceiverBlockMe;

  if(userId){
    const user = await client.user.findUnique({
      where:{
        id:userId
      },
      select:{
        id:true,
        deviceToken:true,
        blockUsers:{
          select:{
            id:true,
          },
        },
        // userName:true
      },
    });
    // UserOnRoom 는 무조건 유저가 한명이네. Room 에 UserOnRoom 를 두개 가지고 있는 거임.
    // .UserOnRoom({
    //   where:{
    //     user:{
    //       id:loggedInUser.id
    //     }
    //   }
    // })
    if(!user) return {ok:false, error:"해당 유저가 존재하지 않습니다."};

    const isUserBlockOpponent = await client.user.findUnique({
      where:{
        id:loggedInUser.id,
      },
      select:{
        blockUsers:{
          where:{
            id:userId
          },
          select:{
            id:true,
          },
        },
      },
    });
    if(isUserBlockOpponent.blockUsers.length !== 0) {
      console.error("sendMessage // 차단한 유저한테 메세지 보냄. 해킹 가능성 있음.");
      return { ok:false, error:"차단한 유저에게 메세지를 보낼 수 없습니다." };
    }
    
    receiversDeviceToken = user.deviceToken;
    // receiversUserName = user.userName;
    isReceiverBlockMe = user.blockUsers.some(user=>user.id === loggedInUser.id);

    const alreadyRoomHave = await findRoomId(loggedInUser.id,user.id);
    
    if(alreadyRoomHave){
      room = alreadyRoomHave;
    } else {
      
      room = await client.room.create({
        data:{
          UserOnRoom:{
            create:[
              {
                user:{
                  connect:{
                    id:loggedInUser.id,
                  },
                },
                isBlockOpponent:false,
              },
              {
                user:{
                  connect:{
                    id:userId
                  }
                },
                isBlockOpponent:isReceiverBlockMe,
              }
            ]
          }
        },
        select:{
          id:true,
        },
      });
    }
  } else if (roomId) {
    // room = await client.room.findFirst({
    const getRoom = await client.room.findFirst({
      where:{
        id:roomId,
        UserOnRoom:{
          some:{
            userId:loggedInUser.id
          }
        }
      },
      select:{
        id:true,
        UserOnRoom:{
          select:{
            userId:true,
            isBlockOpponent:true,
            user:{
              select:{
                deviceToken:true,
                // userName:true,
              }
            }
          }
        }
      },
    });
    room = getRoom;
    if(!room) return {ok:false, error:"Room not found"};

    
    const userOnRoom = getRoom.UserOnRoom
    const loggedInUserIndex = userOnRoom.findIndex(useObj => useObj.userId === loggedInUser.id);
    console.log("userOnRoom")
    console.log(userOnRoom[loggedInUserIndex])
    if(userOnRoom[loggedInUserIndex].isBlockOpponent === true) {
      console.error("sendMessage // 차단한 유저한테 메세지 보냄. 해킹 가능성 있음.")
      return { ok:false, error:"차단한 유저에게 메세지를 보낼 수 없습니다." }
    }

    // 수신하는 유저 id, deviceToken, 차단여부 받음
    const receiverUserIndex = loggedInUserIndex === 0 ? 1 : 0;
    const receiverUser = userOnRoom[receiverUserIndex];
    // const receiverUser = getRoom.UserOnRoom.filter(useObj => useObj.userId !== loggedInUser.id)[0]

    userId = receiverUser.userId;
    receiversDeviceToken = receiverUser.user.deviceToken;
    isReceiverBlockMe = receiverUser.isBlockOpponent;
    // receiversUserName = receiverUser.user.userName;
  };

  const message = await client.message.create({
    data:{
      room:{
        connect:{
          id:room.id
        }
      },
      user:{
        connect:{
          id:loggedInUser.id
        }
      },
      payload
    },
    // include user 해야함.
    include:{
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      },
    },
  });
  
  // room updatedAt 를 바꿔줘서 rooms 조회시 최신에 뜨게
  await client.room.update({
    where:{
      id:room.id
    },
    data:{
      updatedAt:new Date()
    }
  });

  // 상대가 유저를 차단한 상태면 pubsub 안함
  if(!isReceiverBlockMe){
    // 디바이스 push, subscription 날림. 오류나도 진행.
    try {
      await pubsub.publish(NEW_MESSAGE,{roomUpdate:{...message}});
      // {userId} 객체로 안보내고 그냥 userId 를 보내니까 헷갈리지 않도록. 헷갈리면 나중에 변경.
      await pubsub.publish(GET_MESSAGE,{justAlertThereIsNewMessage:userId});

      // 디바이스 push 알림 전송
      const messageChannel = channel.message;
      const sendMessage = `${loggedInUser.userName} : ${payload}`
      
      const obj = {
        roomId:String(room.id),
        senderUserName:loggedInUser.userName,
        receiverUserId:String(userId),
        // id:String(room.id),
        // opponentUserName:receiversUserName,
      };
      sendSinglePushNotification(messageChannel,receiversDeviceToken,sendMessage,obj);

    } catch (e) {
      console.log("sendMessage pubsub 에러 : "+e);
    }
  }

  // roomId 를 인자로 받았을 때 (Room 에서 쿼리 날림) / userId 를 인자로 받았을 때 (Room 없는 상태에서 메세지 보냈을 때)
  // 헷갈리면 아예 로직 전체를 roomId 들어왔을 때 / userId 들어왔을 때 로 나눠서 작성
  if(roomId) {
    return { ok:true, id:message.id };
  } else {
    return { ok:true, roomId:room.id, talkingTo:message.user };
  }
};

const resolver: Resolvers = {
  Mutation :{
    sendMessage:protectResolver(sendMessageFn)
  }
};

export default resolver;