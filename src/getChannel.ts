
export const channel = {
  // upload:"upload",
  uploadPost: "uploadPost",
  uploadPetLog: "uploadPetLog",
  message: "message",
  follow: "follow",
  postLike: "postLike",
  postComment: "postComment",
  commentLike: "commentLike",
  commentComment: "commentComment",
  commentCommentLike: "commentCommentLike",
  petLogLike: "petLogLike",
  petLogComment: "petLogComment",
  petLogCommentLike: "petLogCommentLike",
  petLogCommentComment: "petLogCommentComment",
  petLogCommentCommentLike: "petLogCommentCommentLike",
};

export const getChannel = (which) => {
  switch (which) {
    // case 'FOLLOWING_WRITE_POST':
    //   return channel.upload
    case 'FOLLOW_ME':
      return channel.follow;
    case 'MY_COMMENT_GET_COMMENT':
      return channel.commentComment;
    case 'MY_COMMENT_GET_LIKE':
      return channel.commentLike;
    case 'MY_COMMENT_OF_COMMENT_GET_LIKE':
      return channel.commentCommentLike;
    case 'MY_POST_GET_COMMENT':
      return channel.postComment;
    case 'MY_POST_GET_LIKE':
      return channel.postLike;
      
    case 'FOLLOWING_WRITE_POST':
      return channel.uploadPost;
    case 'FOLLOWING_WRITE_PETLOG':
      return channel.uploadPetLog;
    case 'MY_PETLOG_COMMENT_GET_COMMENT':
      return channel.petLogCommentComment;
    case 'MY_PETLOG_COMMENT_GET_LIKE':
      return channel.petLogCommentLike;
    case 'MY_PETLOG_COMMENT_OF_COMMENT_GET_LIKE':
      return channel.petLogCommentCommentLike;
    case 'MY_PETLOG_GET_COMMENT':
      return channel.petLogComment;
    case 'MY_PETLOG_GET_LIKE':
      return channel.petLogLike;
    default:
      return "Unknown Channel";
  }
};
