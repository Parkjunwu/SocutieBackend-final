import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Mutation: {
    verifyEmailToken: async (_, { token, email }, { client }) => {
      console.log("email")
      console.log(email)
      try {
        // 새로고침 하거나 여러번 눌렀을 경우? 그냥 됬다고 함.
        const isEmail = await client.user.findUnique({
          where:{
            email
          }
        });

        if (isEmail) {
          return { ok:true };
        }

        const isToken = await client.token.findUnique({
          where:{
            payload:token,
          },
        });

        if (!isToken) {
          return {ok:false, error:"invalid token"};
        }

        const { id:tokenId, userName, email:tokenEmail, password, realName, birth, gender } = isToken;

        const createAccount = await client.user.create({
          data: {
            userName,
            email:tokenEmail,
            password,
            ...(realName && { realName }),
            ...(birth && { birth }),
            ...(gender && { gender }),
          },
          select:{
            id:true,
          }
        });

        if(!createAccount) {
          return {ok:false, error:"유저 생성 실패"};
        } else {
          // 토큰 삭제
          await client.token.delete({
            where:{
              id:tokenId,
            },
            select:{
              id:true,
            },
          });
          return {ok:true};
        }
        
      } catch (e) {
        console.error("verifyEmailToken 에러 : "+e)
        return {ok:false, error:"verifyEmailToken server error"};
      }
    },
  },
};
export default resolver;
