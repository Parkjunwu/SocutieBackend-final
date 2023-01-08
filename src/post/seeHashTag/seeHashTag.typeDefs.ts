import { gql } from "apollo-server-express";

// cursorId 는 프론트에서 써야 할듯.
export default gql`
  type SeeHashTagResponse {
    cursorId:Int
    hasNextPage:Boolean
    posts:[Post]
    error:String
  }
  type Query{
    seeHashTag(
      name:String!,
      cursorId:Int
    ):SeeHashTagResponse
  }
`