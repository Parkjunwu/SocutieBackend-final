import { gql } from "apollo-server-express";

export default gql`
  # seeCommentLikes 에 SeeLikesResponse 있음. seePetLogLikes, seeCommentOfCommentLikes 에도 똑같이 씀
  type Query {
    seePetLogCommentLikes(petLogCommentId:Int!,cursorId:Int):SeeLikesResponse!
  }
`;