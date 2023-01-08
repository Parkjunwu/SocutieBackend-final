
const jwt = require("jsonwebtoken");
import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Mutation: {
    autoLogin: async (_, { token }, { client }) => {
      // DB refreshToken 확인 구현해야함. 먼저 확인해서 없으면 로그인 안되게. 안그러면 refreshToken 이 여러개 굴러댕기고 대응 못함.
      try {
        const { id } = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
        
        if(!id) {
          return {ok:false, error:"invalid token"};
        }

        const user = await client.user.findUnique({ where: { id } });
        
        if (user) {
          const accessToken = await jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '30m' });
          
          return {ok:true, loggedInUser:user, accessToken};
        } else {
          return {ok:false, error:"no user"};
        }
      } catch (e) {
        console.error("autoLogin 에러 : e")
        return {ok:false, error:"autoLogin server error"};
      }
    },
  },
};
export default resolver;
