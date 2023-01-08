import { gql } from "apollo-server-express";

export default gql`
  type SeeNewPetLogListResponse {
    cursorId: Int
    hasNextPage: Boolean
    petLogs: [PetLog]
    error: String
  }
  type Query {
    seeNewPetLogList(
      cursorId: Int
    ): SeeNewPetLogListResponse!
  }
`;