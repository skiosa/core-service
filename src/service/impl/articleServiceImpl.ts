import { Arg, Query, Resolver } from 'type-graphql';
import { dataSource } from '../../datalayer/db';
import { Article } from '../../model/article';
import { ArticleService } from '../articleService';

@Resolver(Article)
export class ArticleServiceImpl implements ArticleService {

    @Query(returns => [Article])
    getArticles(): Promise<Article[]> {
        const articleRepository = dataSource.getRepository(Article);
        return new Promise((resolve, reject) => {
            articleRepository.find()
                .then(articles => resolve(articles))
                .catch(err => reject(err));
        });
    }

    @Query(returns => Article)
    getArticle(@Arg("id") id: number): Promise<Article> {
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