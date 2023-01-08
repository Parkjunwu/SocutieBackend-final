import { gql } from "apollo-server-express";

export default gql`
  # Upload 는 JSON 으로 하니까 안뜸.
  # input addFileObj {
  #   index: Int
  #   File: Upload
  # }
  type Mutation {
    editPetLog(
      id:Int!,
      title:String,
      body:[String],
      thumbNail:Upload,
      deletePrevThumbNail:Boolean,
      # addFileArr:[addFileObj],
      # 그래서 그냥 파일과 인덱스를 따로 받음. 안헷갈리게 주의. 순서가 같아야 하는거 중요.
      addFileArr:[Upload],
      addFileIndexArr:[Int],
      deleteFileArr:[String],
      # wholeFileArr 는 addFileIndex 자리를 "" 로 해줘야함. 꼭 확인
      wholeFileArr:[String],
    ):MutationResponse!
  }
`