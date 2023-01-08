import { gql } from "apollo-server-express";

export default gql`
  type TogglePetLogLikeResult {
    ok:Boolean!
    error:String
  }
  type Mutation {
    togglePetLogLike(
      id:Int!
    ):TogglePetLogLikeResult
  }
`