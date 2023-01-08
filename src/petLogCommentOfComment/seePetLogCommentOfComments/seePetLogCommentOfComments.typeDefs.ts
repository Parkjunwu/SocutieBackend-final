import { gql } from "apollo-server-express";

export default gql`
  type SeePetLogCommentOfCommentsResponse implements CursorPagination {
    cursorId:Int,
    hasNextPage:Boolean,
    commentOfComments:[PetLogCommentOfComment],
    error:String,
    # 프론트엔드에서 subscription 데이터 받기 위함... 다른 방법이 안떠오름.
    isNotFetchMore:Boolean,
    # 얘도 프론트엔드에서 createComment 시 seeCommentOfComments 캐시가 너무 오래됬으면 삭제하기 위함
    # fetchedTime:String,
  }
  type Query {
    seePetLogCommentOfComments(
      petLogCommentId:Int!,
      cursorId:Int,
      # cursorId 부터 끝까지 다받음
      isGetAllCommentOfComments:Boolean,
    ):SeePetLogCommentOfCommentsResponse!
  }
`;