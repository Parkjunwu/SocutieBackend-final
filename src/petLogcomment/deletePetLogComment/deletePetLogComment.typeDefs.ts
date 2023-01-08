import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    deletePetLogComment(
      id:Int!
    ):MutationResponse!
  }
`