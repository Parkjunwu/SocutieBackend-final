import { gql } from "apollo-server-express";

export default gql`
  type GetNotifiedPetLogCommentOfCommentResponse {
    petLogCommentOfComment:PetLogCommentOfComment
    error:String
  }
  type Query {
    getNotifiedPetLogCommentOfComment(
      petLogCommentOfCommentId:Int!
      # 댓글이나 유저를 삭제했거나 해서 못받을 수 있음. 필수 아닌걸로
    ):GetNotifiedPetLogCommentOfCommentResponse!
  }
`