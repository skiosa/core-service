import { Article } from "skiosa-orm";
import { UserInfo } from "../model/jwt";
import { PaginationArg } from "../model/paginationArg";

export interface BookmarkService {
  /**
  * @author Lukas Huida
  * @summary change bookmark status for article
  * @description either create or delete a article-bookmark to the current user
  * @param articleId - to bookmark to
  * @param isBookmarked - new bookmark status
  * @param currentUserInfo - jwt info of logged in user
  * @returns {boolean} new bookmark status
  */
  changeBookmark(currentUserInfo: UserInfo, articleId: number, isBookmarked: boolean): Promise<boolean>;

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
