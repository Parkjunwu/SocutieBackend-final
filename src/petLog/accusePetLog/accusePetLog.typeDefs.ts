import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    accusePetLog(
      id:Int!
      reason:Int!
      detail:String
    ):MutationResponse!
  }
`