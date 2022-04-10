import { Article, Category, Feed, User } from "skiosa-orm";
import { PaginationArg } from "../model/paginationArg";

export interface FeedService {
  //Querys:

  /**
   * @author Marcel Alex, Jonas Eppard
   * @summary Get all feeds
   * @description Get all feeds from the database without relations
   * @param {PaginationArg} paginated - Pagination Arguments for return
   * @returns {Feed[]} List of Queried Feeds
   */
  feeds(paginated?: PaginationArg): Promise<Feed[]>;

  /**
   * @author Marcel Alex, Jonas Eppard
   * @summary Get a feed by id
   * @description Get a feed by id from the database without relations, errors if Feed is not found
   * @param {Feed} id - Feed ID
   * @returns {Feed} Queried Feed with specified ID
   *
   */
  feed(id: number): Promise<Feed>;

  //FieldResolvers:
  /**
   * @author Marcel Alex, Jonas Eppard
   * @summary Get articles from a feed
   * @description Get articles from a feed from the database without relations
   * @param {Feed} feed - Feed from which to get articles
   * @param {PaginationArg} paginated - Pagination Arguments for articles
   * @returns {Article[]} List of Queried Articles
   *
   */
  articles(feed: Feed, paginated?: PaginationArg): Promise<Article[]>;

  /**
   * @author Marcel Alex, Jonas Eppard
   * @summary Get number of articles from a feed
   * @description Get number of articles from a feed from the database
   * @param {Feed} feed - Feed from which to get number of articles
   * @returns {number} Number of articles in feed
   *
   */
  articleCount(feed: Feed): Promise<number>;


  /**
   * @author Jonas Eppard
   * @summary Get list of categories from a feed
   * @description Get list of categories from a feed from the database with respect to pagination Argument
   * @param {Feed} feed - Feed from which to get categories
   * @param {PaginationArg} paginated - Pagination Arguments for categories
   * @returns {Category[]} List of Queried Categories 
   */
  categories(feed: Feed, paginated?: PaginationArg): Promise<Category[]>;

  /**
   * @author Jonas Eppard
   * @summary Get number of categories from a feed
   * @description Get number of categories from a feed from the database
   * @param {Feed} feed - Feed from which to get number of categories
   * @returns {number} Number of categories in feed
   */
  categoryCount(feed: Feed): Promise<number>;


  /**
   * @author Jonas Eppard
   * @summary Get list of subscribed users from a feed
   * @description Get list of subscribed users from a feed from the database with respect to pagination Argument
   * @param {Feed} feed - Feed from which to get subscribed users
   * @param {PaginationArg} paginated - Pagination Arguments for subscribed users
   * @returns {User[]} List of Subscribed Users
   */
  subscribers(feed: Feed, paginated?: PaginationArg): Promise<User[]>;

  /**
   * @author Jonas Eppard
   * @summary Get number of subscribed users from a feed
   * @description Get number of subscribed users from a feed from the database
   * @param {Feed} feed - Feed from which to get number of subscribed users
   * @returns {number} Number of subscribed users in feed 
   */
  subscriberCount(feed: Feed): Promise<number>;
}
