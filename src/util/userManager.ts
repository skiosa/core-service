import { dataSource, User } from "skiosa-orm";
import { UserInfo } from "../model/jwt";

export function createUser(userInfo: UserInfo): Promise<User> {
  const userRepository = dataSource.getRepository(User);

  return new Promise((resolve, reject) => {
    userRepository
      .findOneBy({ id: userInfo.id })
      .then((userResult) => {
        if (!userResult) {
          const user: User = { id: userInfo.id as string };
          userRepository
            .save(user)
            .then(() => {
              resolve(user);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve(userResult);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
