import { Article } from "skiosa-orm";
import { PaginationArg } from "../model/paginationArg";

export interface ArticleService {
  getArticles(): Promise<Article[]>;
  /**
   * @author Jonas Eppard
   * @summary Get recommended Articles
   * @description Get all recommended Articles from a User
   * @param {number} seed - Seed for random articles to insure proper pagination
   * @param {PaginationArg} paginated - Pagination Arguments for return
   * @returns {Article[]} List of recommended Articles
   */
  recommendedArticles(seed: number, paginated?: PaginationArg): Promise<Article[]>;
  getArticle(id: number): Promise<Article>;
}
