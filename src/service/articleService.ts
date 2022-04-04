import { Article } from "skiosa-orm/lib/model/article";

export interface ArticleService {
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article>;
}
