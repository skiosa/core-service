import { Article } from "skiosa-orm/lib/model/article";
import { Feed } from "skiosa-orm/lib/model/feed";
import { UserInfo } from "../model/jwt";
import { PaginationArg } from "../model/paginationArg";

export interface SubscriptionService {

  /**
   * @author Amos Gross
   * @summary change subscription status
   * @description either create or delete a subscription to the current user
   * @param feedId - to subscribe to 
   * @param isSubscribed - new subscription status
   * @param currentUserInfo - jwt info of logged in user
   * @returns {boolean} new subscription status
   */
    changeSubscription(currentUserInfo: UserInfo, feedId: number, isSubscribed: boolean): Promise<boolean>,

  /**
   * @author Amos Gross
   * @summary list subscriptions
   * @description lists all feeds/subscription of the current user
   * @returns {Feed[]} list of subscribed feeds
   */
    subscriptions(currentUserInfo: UserInfo): Promise<Feed[]>,

  /**
   * @author Amos Gross
   * @summary list subscription articles
   * @description list recent articles of feeds that a user is subscribed to
   * @param {PaginationArg} paginated - Pagination arguments
   * @returns {boolean} new subscription status
   */
    articlesOfSubscriptions(currentUserInfo: UserInfo, paginated?: PaginationArg): Promise<Article[]>, 
}
