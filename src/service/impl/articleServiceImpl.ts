import { Article } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";
import { Arg, Query, Resolver } from "type-graphql";
import { ArticleService } from "../articleService";

@Resolver(Article)
export class ArticleServiceImpl implements ArticleService {
  @Query((_returns) => [Article])
  getArticles(): Promise<Article[]> {
    const articleRepository = dataSource.getRepository(Article);
    return new Promise((resolve, reject) => {
      articleRepository
        .find()
        .then((articles) => resolve(articles))
        .catch((err) => reject(err));
    });
  }

  @Query((_returns) => Article)
  getArticle(@Arg("id") id: number): Promise<Article> {
    const articleRepository = dataSource.getRepository(Article);
    return new Promise((resolve, reject) => {
      articleRepository
        .findOneBy({ id: id })
        .then((article) => {
          if (article) {
            resolve(article);
          } else {
            reject(null);
          }
        })
        .catch((err) => reject(err));
    });
  }
}
