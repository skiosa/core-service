import { Article } from "skiosa-orm";
import { UserInfo } from "../model/jwt";
import { PaginationArg } from "../model/paginationArg";

export interface BookmarkService {
    /**
     * @author Lukas Huida
     * @summary add article to bookmarks
     * @description adds an article to the current user's bookmarks
     */
    addBookmark(currentUserInfo: UserInfo, articleId: number): Promise<boolean>;

    /**
     * @author Lukas Huida
     * @summary delete article from bookmarks
     * @description removes an article from the current user's bookmarks
     */
    deleteBookmark(currentUserInfo: UserInfo, articleId: number): Promise<boolean>;

    /**
     * @author Lukas Huida
     * @summary list bookmarks of user
     * @description list all bookmarks of the current user
     * @param {UserInfo} currentUserInfo - UserInfo of the current logged in user
     * @param {PaginationArg} paginated - Pagination arguments
     * @returns {Article[]} list of bookmarked articles
     */
    bookmarks(currentUserInfo: UserInfo, paginated?: PaginationArg): Promise<Article[]>;
}