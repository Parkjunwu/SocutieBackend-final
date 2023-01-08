import { gql } from "apollo-server-express";

export default gql`
  # 업로드 타입 정의
  scalar Upload
  # 결과를 완료 + Post 로 해야 할듯
  type UploadPostResponse {
    ok:Boolean!,
    error:String,
    uploadedPost:Post
  }
  type Mutation {
    uploadPost(
      # file:Upload!
      photoArr:[Upload]!,
      caption:String,
      isFirstVideo:Boolean!,
      firstVideoPhoto:Upload,
    ): UploadPostResponse!
  }
`