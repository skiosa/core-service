import { Article } from "skiosa-orm";

export interface ArticleService {
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article>;
}
