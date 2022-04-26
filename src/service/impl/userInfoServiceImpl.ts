import { User } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";
import { Authorized, Mutation, Query, Resolver } from "type-graphql";
import { CurrentUser } from "../../model/context";
import { UserInfo } from "../../model/jwt";
import { UserInfoService } from "../userInfoService";

@Resolver(UserInfo)
export class UserInfoServiceImpl implements UserInfoService {
  @Query((_returns) => UserInfo)
  @Authorized()
  user(@CurrentUser() currentUser: UserInfo): Promise<UserInfo> {
    return Promise.resolve(currentUser);
  }

  @Mutation((_) => User)
  @Authorized()
  createSelf(@CurrentUser() currentUser: UserInfo): Promise<User> {
    const userRepository = dataSource.getRepository(User);
    return new Promise(async (resolve, reject) => {
      if (!currentUser.id) {
        reject("no userid in UserInfo of user");
        return;
      }
      const user: User = { id: currentUser.id };

      await userRepository.save(user);
      resolve(user);
    });
  }
}
