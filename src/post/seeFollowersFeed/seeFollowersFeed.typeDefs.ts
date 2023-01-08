import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeFollowersFeed(offset:Int!):[Post]
  }
`