import { gql } from "apollo-server-express";

export default gql`
  type TogglePetLogCommentOfCommentLikeResult {
    ok:Boolean!
    error:String
  }
  type Mutation {
    togglePetLogCommentOfCommentLike(
      id:Int!
    ):TogglePetLogCommentOfCommentLikeResult!
  }
`