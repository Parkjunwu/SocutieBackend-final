import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { notGetBlockUsersLogicNeedLoggedInUserId } from "../../user/user.utils";

const logicSeeNewPetLogList:Resolver = async(_,{cursorId},{client,loggedInUser}) => {

  // 한번에 가져올 포스트 갯수
  const take = 10;

  const loggedInUserId = loggedInUser?.id;

  const petLogs = await client.petLog.findMany({
    // 로그인한 유저인 경우 차단 유저 제외
    ...(loggedInUserId && {
      where: {
        user: notGetBlockUsersLogicNeedLoggedInUserId(loggedInUserId),
        // 신고 게시물 제외? 확인 필요. + 신고 몇개 이상 게시물도 안보이게
        accused: {
          none: {
            userId: loggedInUserId,
          },
        },
      },
    }),
    orderBy:{
      // createdAt:"desc",
      id: "desc",
    },
    take,
    ...(cursorId && {cursor:{id:cursorId}, skip:1}),
    select:{
      id:true,
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        },
      },
      title:true,
      thumbNail:true,
      // body 를 두줄만 받게 프론트에서 얘도 따로 저장하는게 나을듯?
      // body 말고 좋아요랑 댓글 조회수 이런걸 넣자
      // body:true,
      createdAt:true,
    },
  });

  const petLogsCount = petLogs.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = petLogsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = petLogs[petLogsCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      petLogs,
    };
  } else {
    return {
      hasNextPage:false,
      petLogs,
    };
  }
};

const seeNewPetLogListFn: Resolver = async(_,args,context) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeNewPetLogList(_,args,context,null),
    "seeNewPetLogList"
  );
};

const resolver: Resolvers = {
  Query: {
    seeNewPetLogList: seeNewPetLogListFn,
  },
};

export default resolver;