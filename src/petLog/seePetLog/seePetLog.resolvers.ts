import { Resolver, Resolvers } from "../../types";

const seePetLogFn: Resolver = async(_,{id},{client,}) => {

  // 얘도 차단 걸를라면 걸러
  const petLog = await client.petLog.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      body: true,
      file: true,
      // userId 를 받아야 얘로 isMine 받음.
      userId: true,
    },
    // 유저 정보 include ? route 로 받음.
    // include:{
    //   user:{
    //     select:{
    //       id:true,
    //       userName:true,
    //       avatar:true,
    //     },
    //   },
    // },
  });
  return petLog;
};

const resolver: Resolvers = {
  Query:  {
    seePetLog: seePetLogFn,
  },
};

export default resolver;