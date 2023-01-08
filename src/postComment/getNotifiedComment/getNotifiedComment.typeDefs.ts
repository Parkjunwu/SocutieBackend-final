import { gql } from "apollo-server-express";

// 일단 쓰진 않음. 걍 push noti 에서 commentId 받아서 seeComments로 받음.

export default gql`
  type GetNotifiedCommentResponse {
    comment:Comment
    error:String
  }
  type Query {
    getNotifiedComment(
      commentId:Int!
      # 댓글이나 유저를 삭제했거나 해서 못받을 수 있음. 필수 아닌걸로
    ):GetNotifiedCommentResponse!
  }
`