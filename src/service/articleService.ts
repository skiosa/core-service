import { Category } from "skiosa-orm";
import { Article } from "skiosa-orm/lib/model/article";
import { Author } from "skiosa-orm/lib/model/author";
import { Feed } from "skiosa-orm/lib/model/feed";
import { PaginationArg } from "../model/paginationArg";

export interface ArticleService {
  // Queries
  /**
   * @author Theo Krinitz
   * @summary Returns all articles
   * @description Returns all articles from the database with respect to the pagination arguments
   * @param {PaginationArg} paginated - Pagination arguments
   * @returns {Promise<Article[]>} - Promise of all articles
   */
  articles(paginated?: PaginationArg): Promise<Article[]>;

  /**
   * @author Theo Krinitz
   * @summary Returns one article
   * @description Returns one article from the database with respect to the id
   * @param {number} id - Id of the article
   * @returns {Promise<Article>} - Promise of one article
   */
  article(id: number): Promise<Article>;

  //Field-Resolvers
  /**
   * @author Theo Krinitz, Jonas Eppard
   * @summary Get author from article
   * @description Get author from an article from the database
   * @param {Article} article - Article from which to get the author
   * @returns {Author} Queried Author
   *
   */
  author(article: Article): Promise<Author>;

  /**
   * @author Theo Krinitz
   * @summary Get feed from article
   * @description Get the feed in which an article was published from database
   * @param {Article} article - Article from which to get the feed
   * @returns {Author} Queried feed
   *
   */
  feed(article: Article): Promise<Feed>;

  /**
   * @author Theo Krinitz
   * @summary Get categories from article
   * @description Get the categories from the article from database
   * @param {Article} article - Article from which to get the categories
   * @returns {Category[]} Queried categories
   *
   */
  categories(article: Article): Promise<Category[]>;

  /**
   * @author Theo Krinitz
   * @summary Get amount of categories from article
   * @description Get the amount of categories from the article from database
   * @param {Article} article - Article from which to get the number of categories
   * @returns {number} number of categories of this article
   *
   */
  categoryCount(article: Article): Promise<number>;

  /**
   * @author Theo Krinitz
   * @summary Get amount of categories from article
   * @description Get the amount of likes of this article from database
   * @param {Article} article - Article from which to get the number of likes
   * @returns {number} number of likes of this article
   *
   */
  likeCount(article: Article): Promise<number>;

  /**
   * @author Theo Krinitz
   * @summary Get number of users who bookmarked this article
   * @description Get the number of users who bookmarked this article from database
   * @param {Article} article - Article from which to get the number of bookmarks
   * @returns {number} Users who bookmarked the article
   *
   */
  bookmarkCount(article: Article): Promise<number>;
  /**
   * @author Jonas Eppard
   * @summary Get recommended Articles
   * @description Get all recommended Articles from a User
   * @param {number} seed - Seed for random articles to insure proper pagination
   * @param {PaginationArg} paginated - Pagination Arguments for return
   * @returns {Article[]} List of recommended Articles
   */
  recommendedArticles(seed: number, paginated?: PaginationArg): Promise<Article[]>;

  /**
   * @author Jonas Eppard
   * @summary Get similar Articles
   * @description Get all similar Articles from given Article ID
   * @param {number} articleId - Article ID to get similar Articles from
   * @param {PaginationArg} paginated - Pagination Arguments for return
   * @returns {Article[]} List of similar Articles
   */
  similarArticles(articleId: number, paginated?: PaginationArg): Promise<Article[]>;
}
