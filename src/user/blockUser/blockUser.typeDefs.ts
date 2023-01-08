import { gql } from "apollo-server-express";

export default gql`
  type BlockUserResponse {
    ok:Boolean!
    error:String
    beforeUnreadTotal:Int
  }
  type Mutation {
    blockUser(
      id:Int!
    ):BlockUserResponse!
  }
`;
