import { gql } from "apollo-server-express";

export default gql`
  type CreatePetLogCommentResponse {
    ok:Boolean!
    error:String
    totalCommentsNumber:Int
    offsetComments:[PetLogComment]
  }
  type Mutation {
    createPetLogComment(
      payload:String!
      petLogId:Int!
    ):CreatePetLogCommentResponse!
  }
`