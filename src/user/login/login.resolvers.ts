const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Mutation: {
    login: async (_, { email, password }, { client }) => {
      // 이메일 양식 확인은 뭐 안해도 되겠지?
      const noUserError = "NO_USER";
      const user = await client.user.findUnique({
        where: {
          email
        },
        select: {
          id: true,
          password: true
        }
      });
      if (!user) {
        const userOnToken = await client.token.findUnique({
          where: {
            email
          },
          select: {
            id: true,
          }
        });
        if(userOnToken){
          return { ok: false, errorCode: "NOT_AUTHENTICATED" };
        } else {
          return { ok: false, errorCode: noUserError };
        }
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return { ok: false, errorCode: noUserError };
      }

      const accessToken = await jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '30m' });
      const refreshToken = await jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });
      
      // DB refreshToken 저장 구현해야함. 로그아웃 로직도 만들어서 DB refreshToken 삭제 구현

      return { ok: true, accessToken, refreshToken };
    },
  },
};
export default resolver;
