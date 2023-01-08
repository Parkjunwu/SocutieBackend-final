import { Resolvers } from "../../types";
import { emailCheck, passwordCheck, userNameCheck, birthCheck, realNameCheck } from "./formCheck";
import sendEmailNeedEmailAndPayload from "./sendEmail";
const bcrypt = require("bcryptjs");

const resolverFn: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { email, password, userName, realName, birth, gender },
      { client }
    ) => {
      if(!emailCheck(email) || !passwordCheck(password) || !userNameCheck(userName) || !realNameCheck(realName) || !birthCheck(birth)) {
        // 프론트에서는 거르는데 백엔드에 형식이 안맞는다? 프론트/백엔드 로직 변경이 아니면 말이 안됨.
        console.error("createAccount 이상한 값 들어옴. 해킹 가능성 있음.")
        return {
          ok: false,
          errorCode: "INVALID_INPUT",
        }
      }
      try {
        const checkingEmailLogic = {
          where: {
            email,
          },
          select:{
            id:true
          }
        };

        const checkEmailOnUser = await client.user.findUnique(checkingEmailLogic);
        
        if (checkEmailOnUser) {
          return {
            ok: false,
            errorCode: "EMAIL",
          };
        }

        const checkEmailOnToken = await client.token.findUnique(checkingEmailLogic);

        if (checkEmailOnToken) {
          return {
            ok: false,
            errorCode: "ALREADY_TOKEN",
          };
        }

        const checkingUserNameLogic = {
          where: {
            userName,
          },
          select:{
            id:true
          }
        };
        
        const checkUserNameOnUser = await client.user.findUnique(checkingUserNameLogic);
        const checkUserNameOnToken = await client.token.findUnique(checkingUserNameLogic);
        
        if (checkUserNameOnUser || checkUserNameOnToken) {
          return {
            ok: false,
            errorCode: "USERNAME",
          };
        }
        
        const uglyPassword = await bcrypt.hash(password, 10);

        // token 생성
        const max = 9999999999;
        const min = 1000000000;
        const payload = Math.floor(Math.random()*(max-min+1)) + min + "";

        const createToken = await client.token.create({
          data: {
            payload,
            userName,
            email,
            password: uglyPassword,
            ...(realName && { realName }),
            ...(birth && { birth: Number(birth) }),
            ...(gender && { gender }),
          },
          select:{
            id:true,
          }
        });
        
        // 이메일 전송
        sendEmailNeedEmailAndPayload(email,payload);

        // 30분 후에 인증 안됐을 시 토큰 삭제
        setTimeout(async()=>{
          console.log("유저 생성 30분 후");
          const isUserNotVerify = await client.token.findUnique({
            where:{
              id:createToken.id,
            },
            select:{
              id:true,
            },
          });
          if(isUserNotVerify) {
            await client.token.delete({
              where:{
                id:createToken.id,
              },
            });
            console.log("create Account delete done!");
          }
        },1800000);


        return { ok: true };

      } catch (e) {
        console.error("createAccount 에러 : "+e)
        return {
          ok: false,
          errorCode: "UNKNOWN",
        };
      }
    },
  },
};

export default resolverFn;
