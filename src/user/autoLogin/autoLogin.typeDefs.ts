import { gql } from "apollo-server";

export default gql`
  type LoginResult {
    ok: Boolean!
    error: String
    loggedInUser: User
    accessToken: String
  }
  type Mutation {
    autoLogin(token: String!): LoginResult!
  }
`;
