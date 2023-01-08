import { S3_FOLDER_NAME } from "../../post/post.utils";
import { async_deletePhotoS3, async_uploadPhotoS3 } from "../../shared/AWS";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editPetLogFn: Resolver = async(_, {id, title, body, addFileArr, addFileIndexArr, deleteFileArr, wholeFileArr, thumbNail, deletePrevThumbNail,}, {client, loggedInUser}) => {

  const oldPetLog = await client.petLog.findFirst({
    where:{
      id,
      userId:loggedInUser.id
    },
    select:{
      // id:true,
      thumbNail:true,
    },
  });


  if(!oldPetLog) return {ok:false,error:"Can't edit another user's PetLog"}


  // 일단 받은 배열 wholeFileArr 에 결과를 집어넣음
  // if(wholeFileArr?.length > 10) {
  //   return {ok:false, error:"한 게시물 당 10개 이상의 사진을 올릴 수 없습니다."}
  // }

  if(wholeFileArr && !addFileArr && !addFileIndexArr && !deleteFileArr) {
    // wholeFileArr 가 왔는데 addFileArr, addFileIndexArr, deleteFileArr 가 같이 안오면 에러. 이상한 접근.
    console.log("editPetLog // wholeFileArr doesn't get with addFileArr, addFileIndexArr")
    return {ok:false, error:"알 수 없는 접근입니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
  }

  if(addFileArr?.length !== addFileIndexArr?.length) {
    // addFileArr, addFileIndexArr 하나만 왔거나 addFileArr, addFileIndexArr length 가 안맞으면 이상한 접근.
    console.log("editPetLog // addFileArr, addFileIndexArr 하나만 왔거나 addFileArr, addFileIndexArr length 가 안맞으면 이상한 접근.")
    return {ok:false, error:"알 수 없는 접근입니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
  }

  if(deletePrevThumbNail) {
    const prevThumbNail = oldPetLog.thumbNail;
    if(prevThumbNail === null) {
      console.error("썸넬을 지우라고 했는데 썸넬이 없음. 해킹 가능성 있음")
      return {ok:false,error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
    }
    try {
      await async_deletePhotoS3(prevThumbNail,S3_FOLDER_NAME)
    } catch (e) {
      return {ok:false, error:"Delete file Error"}
    }
  }

    // deleteFileArr, wholeFileArr 왔을 때 검증. 이전 사진 목록과 대조.
  if (deleteFileArr || wholeFileArr) {
    // 이전 사진 목록
    const prevFileArr = await client.petLog.findUnique({
      where:{
        id
      },
      select:{
        file:true
      }
    });
    
    // 전체 목록이 이전에 있는 목록이랑 다른지. 그것도 확인
    if (wholeFileArr) {
      try {
        wholeFileArr.map((url:string) => {
          // 추가할 곳은 넘어감
          if(url === "") return;
          const isInPrevFile = prevFileArr.file.includes(url);
          // 없으면 에러 메세지 출력하고 에러 메세지 전송.
          if(!isInPrevFile){
            throw Error("editPetLog // 전체 사진 목록에 이전 사진 목록에 없는 사진이 있음. 해킹 가능성 있음.")
          }
        })
      } catch (e) {
        console.log(e);
        return { ok:false, error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
      }
    }

    if (deleteFileArr){
      // 여기서 하나라도 다른게 있으면 아예 삭제를 안하거나, 아니면 있는 애들은 지우고 없는 거만 오류 출력하거나.
      // 캐시를 쓰면 실제 데이터와 로컬 데이터가 달라질 수 있어서 문제가 있을 거 같긴 한데, 그래도 아예 안하게 하는게 낫겠지?
      try {
        deleteFileArr.map((url:string) => {
          const isInPrevFile = prevFileArr.file.includes(url);
          // 없으면 에러 메세지 출력하고 에러 메세지 전송.
          if(!isInPrevFile){
            throw Error("editPetLog // 지울 사진이 이전 사진 목록에 없음. 해킹 가능성 있음.")
          }
        })
      } catch (e) {
        console.log(e);
        return { ok:false, error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
      }

      // S3 삭제
      try {
        await Promise.all(
          deleteFileArr.map((async(deleteFileUrl:string) => {
            await async_deletePhotoS3(deleteFileUrl,S3_FOLDER_NAME)
          }))
        )
      } catch (e) {
        return {ok:false, error:"Delete file Error"}
      }
    } 
  }

  if(addFileArr){
    try {
      await Promise.all(
        addFileArr.map(async (fileObj,index) => {
          if(loggedInUser?.id){
            const url = await async_uploadPhotoS3(fileObj, loggedInUser.id, S3_FOLDER_NAME)
            // return  url 
            // wholeFileArr 의 index 에 url 을 넣음
            wholeFileArr[addFileIndexArr[index]] = url;
          }
        })
      )
    } catch (e) {
      console.log(e);
      console.log("editPetLog // S3 사진/영상 업로드 오류");
      return {ok:false, error:"업로드에 실패하였습니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."};
    }
  }

  //  근데 만약 사진은 지웠는데 올리는데서 오류났어, 그러면 다시 복구하는 코드도 작성해야 하지 않나??

  let deleteThumbNailFieldData;
  let gettingThumbNail;

  if(thumbNail) {
    try {
      gettingThumbNail = await async_uploadPhotoS3(thumbNail, loggedInUser.id,S3_FOLDER_NAME);
    } catch (e) {
      console.log(e);
      console.log("editPetLog // S3 사진 업로드 오류");
      return {ok:false, error:"업로드에 실패하였습니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
    }
  }


  if(deletePrevThumbNail && !gettingThumbNail) {
    deleteThumbNailFieldData = true;
  }
  
  const thumbNailFieldNeedChange = gettingThumbNail || deleteThumbNailFieldData;
  
  await client.petLog.update({
    where:{
      id
    },
    data:{
      ...( title && { title }),
      ...( body && { body }),
      // gettingThumbNail 있으면 새 썸넬, 없고 deleteThumbNailFieldData true 면 null 
      ...( thumbNailFieldNeedChange && { thumbNail: gettingThumbNail ?? null }),
      ...( wholeFileArr && { file:wholeFileArr }),
    },
    select:{
      id:true,
    },
  });
  // 결과 PetLog 도 보내줘야 할거 같은데..
  return { ok:true };
};

const resolver: Resolvers = {
  Mutation: {
    editPetLog: protectResolver(editPetLogFn),
  },
};

export default resolver;