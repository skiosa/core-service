import { Article } from '../model/article';


export interface ArticleService {
    getArticles(): Promise<Article[]>;
    getArticle(id: number): Promise<Article>;
    /**
     * Just for testing will be deleted later, bc polling service manages articles
     */
    addArticle(article: Article): Promise<Article>;
    editArticle(article: Article): Promise<Article>;
    deleteArticle(id: string): Promise<Article>;    
}