import { gql } from "apollo-server-express";

export default gql`
  type seeBlockUsersResponse implements CursorPagination {
    cursorId:Int
    hasNextPage:Boolean
    users:[User]
    error:String
    # 프론트엔드에서 subscription 데이터 받기 위함... 다른 방법이 안떠오름.
    # isNotFetchMore:Boolean
    # 로컬로 받아봐야지
  }
  type Query {
    seeBlockUsers(cursorId:Int): seeBlockUsersResponse!
  }
`;