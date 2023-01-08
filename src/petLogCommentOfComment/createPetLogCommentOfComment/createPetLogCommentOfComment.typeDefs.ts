import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createPetLogCommentOfComment(
      payload:String!
      petLogCommentId:Int!
    ):MutationResponse!
  }
`