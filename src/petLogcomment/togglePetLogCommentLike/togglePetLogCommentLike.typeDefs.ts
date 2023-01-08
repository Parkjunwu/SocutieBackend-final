import { gql } from "apollo-server-express";

export default gql`
  # ToggleLikeResult 은toggleCommentLike 에 있음
  type Mutation {
    togglePetLogCommentLike(
      id:Int!
    ):ToggleLikeResult
  }
`