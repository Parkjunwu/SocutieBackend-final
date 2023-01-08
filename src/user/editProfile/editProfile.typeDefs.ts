import { gql } from "apollo-server";

export default gql`
  type Mutation {
    editProfile(
      # realName
      # gender
      # birth
      # blockUsers
      firstName: String
      lastName: String
      userName: String
      email: String
      password: String
      bio: String
      avatar: Upload
    ):MutationResponse!
  }
`;
