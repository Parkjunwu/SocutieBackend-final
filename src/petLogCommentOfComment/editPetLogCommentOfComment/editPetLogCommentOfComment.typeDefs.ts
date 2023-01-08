import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    editPetLogCommentOfComment(
      id:Int!
      payload:String!
    ):MutationResponse!
  }
`