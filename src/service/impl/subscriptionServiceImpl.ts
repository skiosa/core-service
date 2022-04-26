import { dataSource } from "skiosa-orm/lib/db";
import { Article } from "skiosa-orm/lib/model/article";
import { Feed } from "skiosa-orm/lib/model/feed";
import { User } from "skiosa-orm/lib/model/user";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { CurrentUser } from "../../model/context";
import { UserInfo } from "../../model/jwt";
import { PaginationArg } from "../../model/paginationArg";
import { paginate } from "../../util/paginate";
import { SubscriptionService } from "../subscriptionService";

@Resolver()
export class SubscriptionServiceImpl implements SubscriptionService {
  @Mutation(() => Boolean)
  @Authorized()
  async changeSubscription(
    @CurrentUser() currentUserInfo: UserInfo,
    @Arg("feedId") feedId: number,
    @Arg("isSubscribed") isSubscribed: boolean
  ): Promise<boolean> {
    const userRepository = dataSource.getRepository(User);
    const feedRepository = dataSource.getRepository(Feed);

    const currentUser = await getCurrentUserWithSubscriptions(userRepository, currentUserInfo);

    if (isSubscribed) {
      const feed = await feedRepository.findOneBy({
        id: feedId,
      });

      if (!feed) {
        throw new Error("Feed does not exist");
      }

      currentUser.subscriptions?.push(feed);
    } else {
      currentUser.subscriptions = currentUser.subscriptions?.filter((sub: Feed) => {
        return sub.id !== feedId;
      });
    }
    await userRepository.manager.save(currentUser);

    return isSubscribed;
  }

  @Query(() => [Feed])
  @Authorized()
  async subscriptions(@CurrentUser() currentUserInfo: UserInfo): Promise<Feed[]> {
    const userRepository = dataSource.getRepository(User);
    const currentUser = await getCurrentUserWithSubscriptions(userRepository, currentUserInfo);

    if (!currentUser.subscriptions) {
      return [];
    } else {
      return currentUser.subscriptions;
    }
  }

  @Authorized()
  @Query(() => [Article])
  async articlesOfSubscriptions(
    @CurrentUser() currentUserInfo: UserInfo,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    const userRepository = dataSource.getRepository(User);
    const articleRepository = dataSource.getRepository(Article);

    const currentUser = await getCurrentUserWithSubscriptions(userRepository, currentUserInfo);
    if (!currentUser.subscriptions || currentUser.subscriptions.length === 0) {
      return [];
    }

    return articleRepository
      .createQueryBuilder("article")
      .where("article.feedId IN (:...subs)", { subs: currentUser.subscriptions.map((val, _) => val.id) })
      .orderBy("article.publishedAt", "DESC")
      .getMany()
      .then((articles) => paginate(articles, paginated));
  }
}

/**
 * @author Amos Gross
 * @summary fetch user entity for subscriptions
 * @param userRepository - repository to search in
 * @param userInfo - jwt info from user
 * @description fetches the user entity from the database and joins with subscriptions
 * @returns {User} currently logged in user entity
 */
async function getCurrentUserWithSubscriptions(userRepository: Repository<User>, userInfo: UserInfo): Promise<User> {
  if (!userInfo.id) {
    throw new Error("no userId in UserInfo of user, is keycloak broken?");
  }
  const currentUser = await userRepository.findOne({
    relations: {
      subscriptions: true,
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
