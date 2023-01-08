import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seePetLog(
      id:Int!
    ):PetLog
  }
`;