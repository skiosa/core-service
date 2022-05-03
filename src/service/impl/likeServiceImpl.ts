import { Article, dataSource, User } from "skiosa-orm";
import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { CurrentUser } from "../../model/context";
import { UserInfo } from "../../model/jwt";
import { LikeService } from "../likeService";

@Resolver()
export class LikeServiceImpl implements LikeService {
  @Mutation(() => Boolean)
  @Authorized("realm:skiosa-user")
  async addLike(@CurrentUser() currentUserInfo: UserInfo, @Arg("articleId") articleId: number): Promise<boolean> {
    const userRepository = dataSource.getRepository(User);

    return getCurrentUser(userRepository, currentUserInfo).then((currentUser) => {
      return dataSource
        .getRepository(Article)
        .findOneBy({
          id: articleId,
        })
        .then((article) => {
          if (article) {
            currentUser.likes?.push(article);
            return userRepository.manager.save(currentUser).then(() => true);
          } else {
            throw new Error("Article not found");
          }
        });
    });
  }

  @Mutation(() => Boolean)
  @Authorized("realm:skiosa-user")
  async deleteLike(@CurrentUser() currentUserInfo: UserInfo, @Arg("articleId") articleId: number): Promise<boolean> {
    const userRepository = dataSource.getRepository(User);

    return getCurrentUser(userRepository, currentUserInfo).then((currentUser) => {
      return dataSource
        .getRepository(Article)
        .findOneBy({
          id: articleId,
        })
        .then((article) => {
          if (article) {
            currentUser.likes = currentUser.likes?.filter((like: Article) => {
              return like.id !== article.id;
            });

            userRepository.manager.save(currentUser);
            return true;
          } else {
            throw new Error("Article not found");
          }
        });
    });
  }
}

/**
 * @author Tim Horlacher
 * @summary fetch user entity for likes
 * @param userRepository - repository to search in
 * @param userInfo - jwt info from user
 * @description fetches the user entity from the database and joins with likes
 * @returns {User} currently logged in user entity
 */
async function getCurrentUser(userRepository: Repository<User>, userInfo: UserInfo): Promise<User> {
  if (!userInfo.id) {
    throw new Error("no userId in UserInfo of user, is keycloak broken?");
  }
  const currentUser = await userRepository.findOne({
    relations: {
      likes: true,
    },
    where: {
      id: userInfo.id,
    },
  });

  if (!currentUser) {
    throw new Error("user not found");
  }
  return currentUser;
}
