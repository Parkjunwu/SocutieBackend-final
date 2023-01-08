import { gql } from "apollo-server-express";

export default gql`
  type PetLogComment {
    id:Int!
    user:User!
    petLog:PetLog!
    payload:String!
    createdAt:String!
    updatedAt:String!
    isMine:Boolean!
    totalLikes:Int!
    totalCommentOfComments:Int!
    isLiked:Boolean
  }
`