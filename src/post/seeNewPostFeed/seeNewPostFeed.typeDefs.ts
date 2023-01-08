import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeNewPostFeed(offset:Int!):[Post]
  }
`