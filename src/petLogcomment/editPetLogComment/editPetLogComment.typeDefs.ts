import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    editPetLogComment(
      id:Int!
      payload:String!
    ):MutationResponse!
  }
`