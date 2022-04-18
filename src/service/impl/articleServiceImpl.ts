import { Article, Feed } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { ArticleService } from "../articleService";
import { PaginationArg } from "../../model/paginationArg";
import { shuffle } from "shuffle-seed";
import { paginate } from "../../util/paginate";

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

  @Query((_of) => [Article])
  recommendedArticles(@Arg("seed") seed: number, @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg) {
    return dataSource
      .getRepository(Article)
      .find({
        relations: [],
        order: { id: "ASC" },
      })
      .then((articles) => shuffle(articles, seed))
      .then((articles) => paginate(articles, paginated));
  }
  @Query((_returns) => [Article])
  similarArticles(
    @Arg("articleId") articleId: number,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    return this.recommendedArticles(articleId, paginated);
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

  @FieldResolver((_returns) => Feed)
  feed(@Root() article: Article): Promise<Feed> {
    return dataSource
      .getRepository(Article)
      .find({
        relations: ["feed"],
        where: {
          id: article.id,
        },
      })
      .then((articles) => {
        if (articles.length !== 1 || !articles[0].feed) {
          throw new Error(`Article with ID ${article.id} has invalid Format`);
        }
        return articles[0].feed;
      });
  }
}
