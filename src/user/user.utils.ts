import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

export const getUser = async (accessToken:string|undefined) => {
  
  if (!accessToken) return null;
  
  let id;
  try {
    const { id:verifyId } = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    id = verifyId
  } catch (e) {
    console.error("getUser 에러 : "+e)
    // throw new AuthenticationError('UNAUTHENTICATED');
    return "invalid access token"
  }
  try {
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

// 로그인한 상태가 아니면 사용 못함.
export const protectResolver =
  (ourResolver: Resolver) => (root, arg, context, info) => {
    if (!context.loggedInUser) {
      // 쿼리면 null 반환하고 mutation 이면 response 형식으로 반환
      if(info.operation.operation === "query") {
        return null;
      }
      return { ok: false, error: "Please log in to perform this action" };
    }
    return ourResolver(root, arg, context, info);
  };

// 유저 확인..? 에러 메세지를 다르게 줄 수 있음.
export const userCheckResolver =
  (ourResolver: Resolver, errorMessage: String = "That user doesn't exist") =>
  async (root, arg, context, info) => {
    const { client } = context;
    const { id } = arg;
    const ok = await client.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!ok) {
      // if(info.operation.operation === "query") return null;
      return { ok: false, error: errorMessage };
    }
    return ourResolver(root, arg, context, info);
  };

export const notGetBlockUsersLogicNeedLoggedInUserId = (loggedInUserId:number) => ({
  blockedUsers: {
    none: {
      id: loggedInUserId,
    },
  },
});