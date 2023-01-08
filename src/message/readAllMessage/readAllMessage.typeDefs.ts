import { gql } from "apollo-server-express";

export default gql`
  type readAllMessageResponse {
    ok: Boolean!
    error: String
    numberOfRead: Int
  }
  type Mutation {
    readAllMessage(roomId:Int!):readAllMessageResponse!
  }
`