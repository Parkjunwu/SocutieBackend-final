import { gql } from "apollo-server-express";

export default gql`
  type Post {
    id:Int!
    user:User!
    likes:Int!
    caption:String
    file:[String]
    createdAt: String!
    updatedAt: String!
    commentNumber:Int!
    isMine:Boolean!
    isLiked:Boolean!
    accused:[Int]
    firstPhoto:String
    isFirstVideo:Boolean
    # like 제일 많은 하나 가져오기
    bestCommentId:Int
    bestCommentLikes:Int
    bestComment:Comment
  }

# HashTag 는 post 만 받는 걸로 구현함. 따로 타입 만들진 않음.
`