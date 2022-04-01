import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Article, ArticleInput } from '../../model/article';
import { ArticleService } from '../articleService';
import { Author } from '../../model/author';
import { Feed } from '../../model/feed';

@Resolver(Article)
export class ArticleServiceMock implements ArticleService {

    private author: Author = {id: 1, name: "Günther"};
    private feed: Feed = {id: 1, link: "https://lel.lel", ttl: 3600};

    private articles: Article[] = [
        {id: 1, title: "New Article", description: "A very good Article", url: "https://123.de", author: this.author, feed: this.feed},
        {id: 2, title: "Best Article", description: "A very caky Article", url: "https://123.de", author: this.author, feed: this.feed},
        {id: 3, title: "Shit Article", description: "A very shitty Article", url: "https://123.de", author: this.author, feed: this.feed},
    ];

    @Query(returns => [Article])
    getArticles(): Promise<Article[]> {
        return new Promise((resolve, reject) => {
            resolve(this.articles);
        });
    }

    @Query(returns => Article)
    getArticle(@Arg("id") id: number): Promise<Article> {
        return new Promise((resolve, reject) => {
            resolve(this.articles.filter(article => article.id === id)[0]);
        });
    }

    @Mutation(returns => Article)
    addArticle(@Arg("data") articleInput: ArticleInput): Promise<Article> {
        return new Promise((resolve, reject) => {
            this.articles.push(articleInput);
            resolve(articleInput);
        });
        
    }
    editArticle(article: Article): Promise<Article> {
        throw new Error('Method not implemented.');
    }

    @Mutation(returns => Article)
    deleteArticle(id: string): Promise<Article> {
        return new Promise((resolve, reject) => {
            resolve(this.articles.filter(article => article.id === Number(id))[0]);
            this.articles = this.articles.filter(article => article.id !== Number(id));
        });
    }

}