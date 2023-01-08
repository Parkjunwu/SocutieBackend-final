import { gql } from "apollo-server-express";

export default gql`
  type PetLog {
    id: Int!
    user: User!
    title: String!
    body: [String]!
    file: [String]!
    createdAt: String!
    updatedAt: String!
    isMine: Boolean!
    # 동영상으로 받을 수도 있으니까 ThumbNail 로 저장하자
    thumbNail: String
    # firstPhoto: String
    # 굳이 comment 가 필요하면 like 제일 많은 하나 가져오기. 근데 그런건 없을듯?
    likes: Int!
    # comments: [Comment]
    commentNumber: Int!
    isLiked: Boolean!
    accused: [Int]
    # firstPhoto: String
    # isFirstVideo: Boolean
  }

# HashTag 는 post 만 받는 걸로 구현함. 따로 타입 만들진 않음.
`