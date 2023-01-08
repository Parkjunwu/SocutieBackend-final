import { gql } from "apollo-server-express";

export default gql`
  type SearchPetLogsResponse {
    cursorId:Int
    hasNextPage:Boolean
    petLogs:[PetLog]
    error:String
  }
  type Query {
    searchPetLogs(
      keyword:String!,
      cursorId:Int
    ):SearchPetLogsResponse!
  }
`