import { Article } from "skiosa-orm";
import { UserInfo } from "../model/jwt";
import { PaginationArg } from "../model/paginationArg";

export interface BookmarkService {
    /**
     * @author Lukas Huida
     * @summary bookmark article
     * @description bookmark an article
     */
    addBookmark(currentUserInfo: UserInfo, articleId: number): Promise<boolean>;

    /**
     * @author Lukas Huida
     * @summary bookmark article
     * @description bookmark an article
     */
    deleteBookmark(currentUserInfo: UserInfo, articleId: number): Promise<boolean>;

    /**
     * @author Lukas Huida
     * @summary list bookmarks
     * @description list all bookmarks of the current user
     * @returns {Article[]} list of bookmarked articles
     * @param {PaginationArg} paginated - Pagination arguments
     * @returns {Article[]} list of bookmarked articles
     */
    bookmarks(currentUserInfo: UserInfo, paginated?: PaginationArg): Promise<Article[]>;
}