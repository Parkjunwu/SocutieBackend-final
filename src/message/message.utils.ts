import client from "../client";

export const findRoomId = async(loggedInUserId:number,userId:number) => {
  return await client.room.findFirst({
    where:{
      AND:[
        {
          UserOnRoom:{
            some:{
              userId:loggedInUserId
            }
          }
        },
        {
          UserOnRoom:{
            some:{
              userId
            }
          }
        }
      ]
    },
    select:{
      id:true,
    },
  });
};