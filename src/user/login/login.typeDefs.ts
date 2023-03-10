import { gql } from "apollo-server-express";

export default gql`
  enum LoginErrorCode {
    NO_USER
    NOT_AUTHENTICATED
  }
  type LoginResult {
    ok: Boolean!
    accessToken: String
    refreshToken: String
    errorCode: LoginErrorCode
  }
  type Mutation {
    login(email: String!, password: String!): LoginResult!
  }
`;
