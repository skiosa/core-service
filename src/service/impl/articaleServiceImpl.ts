import { dataSource } from '../../datalayer/db';
import { Article } from '../../model/article';
import { ArticleService } from '../articleService';


export class ArticleServiceImpl implements ArticleService {

    getArticles(): Promise<Article[]> {
        const articleRepository = dataSource.getRepository(Article);
        return new Promise((resolve, reject) => {
            articleRepository.find()
                .then(articles => resolve(articles))
                .catch(err => reject(err));
        });
    }

    getArticle(id: number): Promise<Article> {
        const articleRepository = dataSource.getRepository(Article);
        return new Promise((resolve, reject) => {
            articleRepository.findOneBy({ id: id })
                .then(article => {
                    if (article) {
                        resolve(article);
                    } else {
                        reject(null);
                    }
                }).catch(err => reject(err));
        });
    }
    addArticle(article: Article): Promise<Article> {
        throw new Error('Method not implemented.');
    }
    editArticle(article: Article): Promise<Article> {
        throw new Error('Method not implemented.');
    }
    deleteArticle(id: string): Promise<Article> {
        throw new Error('Method not implemented.');
    }

}