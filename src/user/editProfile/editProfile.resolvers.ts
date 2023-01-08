const bcrypt = require("bcryptjs");
import { protectResolver } from "../user.utils";
import { Resolver, Resolvers } from "../../types";
import { async_uploadPhotoS3 } from "../../shared/AWS";
import { userNameCheck } from "../createAccount/formCheck";

const resolverFn: Resolver = async (
  _,
  { firstName, lastName, userName, email, password, bio, avatar },
  { loggedInUser, client }
) => {

  if(!firstName && !lastName && !userName && !email && !password && !bio && !avatar) {
    return { ok: true };
  }

  if(!userNameCheck(userName)) {
    // 프론트에서는 거르는데 백엔드에 형식이 안맞는다? 프론트/백엔드 로직 변경이 아니면 말이 안됨.
    console.error("editProfile 이상한 값 들어옴. 해킹 가능성 있음.")
    return { ok: false, error: "닉네임에는 20자 이하의 영어, 한글, 숫자만 사용 가능합니다."};
  }

  if (bio && bio.length > 100) {
    return { ok: false, error:"소개는 100자 이하로 작성하셔야 합니다." };
  }

  let avatarUrl = null;

  if (avatar) {
    avatarUrl = await async_uploadPhotoS3(avatar, loggedInUser.id, "avatar")
  }

  let uglyPassword = null;

  if (password) {
    uglyPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      ...(firstName && {firstName}),
      ...(lastName && {lastName}),
      ...(userName && {userName}),
      ...(email && {email}),
      ...(bio && {bio}),
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),
    },
    select:{
      id:true,
    },
  });

  if (updatedUser.id) {
    return { ok: true };
  } else {
    return { ok: false, error: "프로필 변경이 실패하였습니다. 지속적으로 같은 문제 발생 시 문의 주시면 감사드리겠습니다." };
  }
};

const resolver: Resolvers = {
  Mutation: {
    editProfile: protectResolver(resolverFn),
  },
};
export default resolver;
