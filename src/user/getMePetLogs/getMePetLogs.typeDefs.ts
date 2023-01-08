import { gql } from "apollo-server-express";

export default gql`
  type GetMePetLogsResponse {
    cursorId:Int
    hasNextPage:Boolean
    petLogs:[PetLog]
    error:String
    # isNotFetchMore:Boolean
  }
  type Query {
    getMePetLogs(cursorId:Int):GetMePetLogsResponse!
  }
`;