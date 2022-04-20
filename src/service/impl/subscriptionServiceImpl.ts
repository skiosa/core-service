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
    changeSubscription(@CurrentUser() currentUserInfo: UserInfo, @Arg("feedId") feedId: number, @Arg("isSubscribed") isSubscribed: boolean): Promise<boolean> {
        const userRepository = dataSource.getRepository(User)
        const feedRepository = dataSource.getRepository(Feed)

        return new Promise(async (resolve, reject) => {
            try {
                // TODO: replace with actual userId
                let currentUser = await getCurrentUserWithSubscriptions(userRepository, currentUserInfo);

                if (isSubscribed) {
                    let feed = await feedRepository.findOneBy({
                        id: feedId
                    })

                    if (!feed) {
                        reject(feed)
                        return
                    }
                    
                    currentUser.subscriptions?.push(feed);
                } else {
                    currentUser.subscriptions = currentUser.subscriptions?.filter((sub: Feed) => {
                        return sub.id !== feedId
                    })
                }
                userRepository
                    .manager
                    .save(currentUser)
                    .then(() => {
                        resolve(isSubscribed)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            } catch (err) {
            }

        })
    }

    @Query(() => [Feed])
    @Authorized()
    subscriptions(@CurrentUser() currentUserInfo: UserInfo): Promise<Feed[]> {
        const userRepository = dataSource.getRepository(User)

        return new Promise(async (resolve, reject) => {
            let currentUser = await getCurrentUserWithSubscriptions(userRepository, currentUserInfo)
            if (!currentUser.subscriptions) {
                resolve([])
            } else {
                resolve(currentUser.subscriptions)
            }
        })
    }

    @Authorized()
    @Query(() => [Article])
    articlesOfSubscriptions(@CurrentUser() currentUserInfo: UserInfo, @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg): Promise<Article[]> {
        const userRepository = dataSource.getRepository(User)
        const articleRepository = dataSource.getRepository(Article)

        return new Promise(async (resolve, _reject) => {
            let currentUser = await getCurrentUserWithSubscriptions(userRepository, currentUserInfo);
            if (!currentUser.subscriptions || currentUser.subscriptions.length === 0) {
                resolve([] as Article[])
                return
            }

            // TODO: sort articles by date, as soon as this is possible in the ORM
            articleRepository
                .createQueryBuilder("article")
                .where("article.feedId IN (:...subs)", {subs: currentUser.subscriptions.map((val, _) => val.id)})
                //.orderBy("article.publishedAt", "DESC")
                .getMany()
                .then((articles) => paginate(articles, paginated))
                .then(vals => {
                    resolve(vals)
                })
        })
    }
}

/**
* @author Amos Gross
* @summary fetch user entity for subscriptions
* @param userRepository - repository to search in
* @description fetches the user entity from the database and joins with subscriptions
* @returns {User} currently logged in user entity
*/
function getCurrentUserWithSubscriptions(userRepository: Repository<User>, userInfo: UserInfo): Promise<User> {
    return new Promise(async (resolve, reject) => {
        if (!userInfo.id) {
            reject('no userid in UserInfo of user');
            return;
        }
        let currentUser = await userRepository
        .findOne({
            relations: {
                subscriptions: true
            },
            where: {
                id: userInfo.id
            }
        })

        if (!currentUser) {
            reject(currentUser)
            return
        }
        resolve(currentUser)
    })

}

