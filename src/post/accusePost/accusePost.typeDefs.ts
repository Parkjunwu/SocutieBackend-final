import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    accusePost(
      id:Int!
      reason:Int!
      detail:String
    ):MutationResponse!
  }
`