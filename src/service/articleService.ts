import { Article } from "../model/article";

export interface ArticleService {
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article>;
}
