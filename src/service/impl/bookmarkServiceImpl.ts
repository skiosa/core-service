import { Article, dataSource, User } from 'skiosa-orm';
import { Arg, Authorized, Mutation, Resolver, Query } from 'type-graphql';
import { Repository } from 'typeorm';
import { CurrentUser } from '../../model/context';
import { UserInfo } from '../../model/jwt';
import { PaginationArg } from '../../model/paginationArg';
import { paginate } from '../../util/paginate';
import { BookmarkService } from '../bookmarkService';

@Resolver()
export class BookmarkServiceImpl implements BookmarkService {

    @Mutation(() => Boolean)
    @Authorized("realm:skiosa-user")
    async addBookmark(@CurrentUser() currentUserInfo: UserInfo, @Arg("articleId") articleId: number): Promise<boolean> {
        const userRepository = dataSource.getRepository(User);
        const articleRepository = dataSource.getRepository(Article);

        const currentUser = await getCurrentUser(userRepository, currentUserInfo);

        return new Promise((resolve, reject) => {
            articleRepository.findOneBy({
                id: articleId,
            }).then(article => {
                if (article) {
                    currentUser.bookmarks?.push(article);
                    userRepository.manager.save(currentUser);
                    resolve(true);
                } else {
                    reject(new Error("Article does not exist"));
                }
            }).catch(() => {
                reject(new Error("Article does not exist"));
            });
        });
    }

    @Mutation(() => Boolean)
    @Authorized("realm:skiosa-user")
    async deleteBookmark(@CurrentUser() currentUserInfo: UserInfo, @Arg("articleId") articleId: number): Promise<boolean> {
        const userRepository = dataSource.getRepository(User);
        const articleRepository = dataSource.getRepository(Article);

        const currentUser = await getCurrentUser(userRepository, currentUserInfo);

        return new Promise((resolve, reject) => {
            articleRepository.findOneBy({
                id: articleId,
            }).then(article => {
                if (article) {
                    currentUser.bookmarks = currentUser.bookmarks?.filter((bookmark: Article) => {
                        return bookmark.id !== articleId;
                    });

                    userRepository.manager.save(currentUser);
                    resolve(true);
                } else {
                    reject(new Error("Article does not exist"));
                }
            }).catch(() => {
                reject(new Error("Article does not exist"));
            });
        });
    }

    @Query(() => [Article])
    @Authorized("realm:skiosa-user")
    async bookmarks(@CurrentUser() currentUserInfo: UserInfo, @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg): Promise<Article[]> {
        const userRepository = dataSource.getRepository(User);
        const currentUser = await getCurrentUser(userRepository, currentUserInfo);

        if (!currentUser.bookmarks || currentUser.bookmarks.length === 0) {
            return [];
        }

        return paginate(currentUser.bookmarks, paginated);
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