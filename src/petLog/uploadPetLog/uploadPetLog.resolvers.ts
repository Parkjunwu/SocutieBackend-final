import { S3_FOLDER_NAME } from "../../post/post.utils";
import { pushNotificationUpload } from "../../pushNotificationAndPublish";
import { async_uploadPhotoS3 } from "../../shared/AWS";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const uploadPetLogFn: Resolver = async(_,{title,fileArr,body,thumbNail,},{client,loggedInUser}) => {
  
  // 업로드할 url 배열
  let addFileUrlArr:Array<string>;
  let thumbNailUrl;
  try {
    //aws 업로드. url 받은 거 데이터베이스에도 씀. await Promise.all , map 같이 써야하는거 유의
    addFileUrlArr = await Promise.all(
      fileArr.map(async (file:any) => {
        if(loggedInUser?.id){
          const url = await async_uploadPhotoS3(file,loggedInUser.id,S3_FOLDER_NAME);
          return url;
        }
      })
    );

    if(thumbNail){
      thumbNailUrl = await async_uploadPhotoS3(thumbNail,loggedInUser.id,S3_FOLDER_NAME);
    }
    // if(firstVideoPhoto) {
    //   firstPhotoForVideo = await async_uploadPhotoS3(firstVideoPhoto,loggedInUser.id,S3_FOLDER_NAME)
    // }
  } catch (e) {
    console.log(e);
    console.log("uploadPetLog // 파일 업로드 에러");
    return {ok:false, error:"파일 업로드에 실패하였습니다."}
  }
  
  // let hashTags = null;
  // if(body) {
  //   hashTags = processHashtags(body)
  // }
  // const isHaveFile = addFileUrlArr.length !== 0;

  const result = await client.petLog.create({
    data:{
      user:{
        connect:{
          id:loggedInUser.id
        },
      },
      title,
      file: addFileUrlArr,
      body,
      // isFirstVideo: Boolean(isFirstVideo),
      // firstPhotoForVideo 있으면 얘고 아니면 첫번째 사진
      // firstPhoto: firstPhotoForVideo ?? addFileUrlArr[0],
      ...(thumbNailUrl && {thumbNail: thumbNailUrl}),
      // ...(hashTags && {PetLogOnHashTag:{
      //   create:hashTags
      // }}),
    },
    // 굳이 다 받을 필요 없으니 얘를 써도 됨. 나머지는 프론트엔드에서 캐시로 구현. 귀찮으면 그냥 전체 다 받음.
    select:{
      id:true,
      createdAt:true,
    }
  });

  const petLogId = result.id;

  // 완료 후 notification 전송 + subscription pubsub 전송
  await pushNotificationUpload(client, loggedInUser.id, petLogId, "petLog");

  return { ok:true, uploadedPetLog:result };
};

const resolver:Resolvers = {
  Mutation: {
    uploadPetLog: protectResolver
    (uploadPetLogFn),
  },
};

export default resolver;