import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    deletePetLogCommentOfComment(
      id:Int!
    ):MutationResponse!
  }
`