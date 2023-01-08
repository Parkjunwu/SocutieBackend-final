import { gql } from "apollo-server-express";

export default gql`
  # 결과를 완료 + PetLog 로 해야 할듯
  type UploadPetLogResponse {
    ok:Boolean!,
    error:String,
    uploadedPetLog:PetLog
  }
  type Mutation {
    uploadPetLog(
      title:String!,
      fileArr:[Upload]!,
      body:[String]!,
      thumbNail:Upload,
      # isFirstVideo:Boolean!,
      # firstVideoPhoto:Upload,
    ): UploadPetLogResponse!
  }
`;