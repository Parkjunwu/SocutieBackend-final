import { gql } from "apollo-server-express";

export default gql`
  type PetLogCommentOfComment {
    id:Int!
    user:User!
    petLogComment:PetLogComment!
    payload:String!
    createdAt:String!
    updatedAt:String!
    isMine:Boolean!
    totalLikes:Int!
    isLiked:Boolean
  }
`