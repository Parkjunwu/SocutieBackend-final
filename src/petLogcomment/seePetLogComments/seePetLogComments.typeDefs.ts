// import { gql } from "apollo-server-express";

// export default gql`
//   type SeePetLogCommentsResponse implements CursorPagination {
//     cursorId:Int
//     hasNextPage:Boolean
//     comments:[PetLogComment]
//     error:String
//     # 프론트엔드에서 subscription 데이터 받기 위함... 다른 방법이 안떠오름.
//     isNotFetchMore:Boolean!
//   }
//   type Query {
//     seePetLogComments(
//       petLogId:Int!,
//       cursorId:Int,
//       isNotification:Boolean,
//     ):SeePetLogCommentsResponse!
//   }
// `;
import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seePetLogComments(petLogId:Int!,offset:Int!):[PetLogComment]
  }
`;