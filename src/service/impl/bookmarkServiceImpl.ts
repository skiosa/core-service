import { Article, dataSource, User } from "skiosa-orm";
import { Arg, Authorized, Mutation, Resolver, Query } from "type-graphql";
import { Repository } from "typeorm";
import { CurrentUser } from "../../model/context";
import { UserInfo } from "../../model/jwt";
import { PaginationArg } from "../../model/paginationArg";
import { paginate } from "../../util/paginate";
import { BookmarkService } from "../bookmarkService";

@Resolver()
export class BookmarkServiceImpl implements BookmarkService {
  @Mutation(() => Boolean)
  @Authorized("realm:skiosa-user")
  async changeBookmark(
    @CurrentUser() currentUserInfo: UserInfo,
    @Arg("articleId") articleId: number,
    @Arg("isBookmarked") isBookmarked: boolean
  ): Promise<boolean> {
    const userRepository = dataSource.getRepository(User);

    return getCurrentUser(userRepository, currentUserInfo).then((currentUser) => {
      return dataSource
        .getRepository(Article)
        .findOneBy({
          id: articleId,
        })
        .then((article) => {
          if (article) {
            if (isBookmarked) {
              currentUser.bookmarks?.push(article);
              return userRepository.manager.save(currentUser).then(() => true);
            } else {
              currentUser.bookmarks = currentUser.bookmarks?.filter((bookmark: Article) => {
                return bookmark.id !== article.id;
              });

              userRepository.manager.save(currentUser);
              return false;
            }
          } else {
            throw new Error("Article not found");
          }
        });
    });
  }

  @Query(() => [Article])
  @Authorized("realm:skiosa-user")
  async bookmarks(
    @CurrentUser() currentUserInfo: UserInfo,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    const userRepository = dataSource.getRepository(User);

    return getCurrentUser(userRepository, currentUserInfo).then((currentUser) => {
      if (currentUser.bookmarks) {
        return paginate(currentUser.bookmarks, paginated);
      } else {
        return [];
      }
    });
  }
}

/**
 * @author Lukas Huida
 * @summary fetch user entity for bookmarks
 * @param userRepository - repository to search in
 * @param userInfo - jwt info from user
 * @description fetches the user entity from the database and joins with bookmarks
 * @returns {User} currently logged in user entity
 */
async function getCurrentUser(userRepository: Repository<User>, userInfo: UserInfo): Promise<User> {
  if (!userInfo.id) {
    throw new Error("no userId in UserInfo of user, is keycloak broken?");
  }
  const currentUser = await userRepository.findOne({
    relations: {
      bookmarks: true,
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
