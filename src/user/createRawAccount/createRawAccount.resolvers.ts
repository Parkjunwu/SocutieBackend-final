import { Resolvers } from "../../types";
const bcrypt = require("bcryptjs");

const resolverFn: Resolvers = {
  Mutation: {
    createRawAccount: async (
      _,
      { email, password, userName, realName, birth, gender },
      { client }
    ) => {
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

        await client.user.create({
          data: {
            userName,
            email,
            password:uglyPassword,
            ...(realName && { realName }),
            ...(birth && { birth }),
            ...(gender && { gender }),
          },
          select:{
            id:true,
          }
        });

        return { ok: true };

      } catch (e) {
        console.error("createRawAccount 에러 : "+e)
        return {
          ok: false,
          errorCode: "UNKNOWN",
        };
      }
    },
  },
};

export default resolverFn;
