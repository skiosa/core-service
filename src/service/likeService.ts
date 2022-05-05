import { UserInfo } from "../model/jwt";

export interface LikeService {
  /**
   * @author Lukas Huida
   * @summary change like status for article
   * @description either create or delete a article-like to the current user
   * @param articleId - to like to
   * @param isLiked - new like status
   * @param currentUserInfo - jwt info of logged in user
   * @returns {boolean} new like status
   */
  changeLike(currentUserInfo: UserInfo, articleId: number, isLiked: boolean): Promise<boolean>;
}
