import { gql } from "apollo-server-express";

export default gql`
  type Query {
    isBlockUser(
      id:Int!
    ): Boolean
  }
`;
