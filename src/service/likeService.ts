import { UserInfo } from "../model/jwt";

export interface LikeService {
  /**
   * @author Tim Horlacher
   * @summary add article to likes
   * @description adds an article to the current user's likes
   * @param {number} articleId - id of an article to like
   * @param {UserInfo} currentUserInfo - jwt info of logged in user
   * @returns {boolean} status of like for this article
   */
  addLike(currentUserInfo: UserInfo, articleId: number): Promise<boolean>;

  /**
   * @author Tim Horlacher
   * @summary delete article from like
   * @description removes an article from the current user's likes
   * @param {number} articleId - id of an article to remove from likes
   * @param {UserInfo} currentUserInfo - jwt info of logged in user
   * @returns {boolean} status of like for this article
   */
  deleteLike(currentUserInfo: UserInfo, articleId: number): Promise<boolean>;
}
