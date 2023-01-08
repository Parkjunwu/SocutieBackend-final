import { gql } from "apollo-server-express";

export default gql`
  type GetUserPetLogsResponse {
    cursorId:Int
    hasNextPage:Boolean
    petLogs:[PetLog]
    error:String
  }
  type Query {
    getUserPetLogs(userId:Int!,cursorId:Int):GetUserPetLogsResponse!
  }
`;