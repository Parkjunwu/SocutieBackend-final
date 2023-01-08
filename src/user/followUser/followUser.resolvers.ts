import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const followUserFn: Resolver = async (
  _,
  { id },
  { loggedInUser, client }
) => {
  
  const ok = await client.user.findUnique({
    where: {
      id,
    },
  });

  if (!ok) {
    return { ok: false, error: "That user doesn't exist" };
  }

  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        connect: {
          id,
        },
      },
    },
    select:{
      id:true,
    },
  });

  // 팔로우 완료 후 notification, subscription
  await pushNotificationNotUploadPost(client, "FOLLOW_ME", loggedInUser.id, id, {userId: loggedInUser.id, userName:loggedInUser.userName});

  return { ok: true };
};

const resolver: Resolvers = {
  Mutation: {
    followUser: protectResolver(followUserFn),
  },
};

export default resolver;
