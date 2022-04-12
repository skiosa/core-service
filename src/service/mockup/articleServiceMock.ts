import { shuffle } from "shuffle-seed";
import { Article, Author, Category, Feed } from "skiosa-orm";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { PaginationArg } from "../../model/paginationArg";
import { ArticleService } from "../articleService";
import { MockService } from "./mockService";

@Resolver(Article)
export class ArticleServiceMock extends MockService implements ArticleService {
  recommendedArticles(
    seed: number,
    paginated?: PaginationArg
  ): Promise<Article[]> {
    return new Promise<Article[]>((resolve, reject) => {
      try {
        const articles = shuffle(this.articlesMock, seed);
        if (paginated) {
          resolve(
            articles.slice(
              paginated.skip ?? 0,
              (paginated.skip ?? 0) + paginated.take
            )
          );
        } else {
          resolve(articles);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  @FieldResolver((_type) => Author)
  author(@Root() article: Article): Author | undefined {
    return article.author;
  }

  @FieldResolver((_type) => Feed)
  feed(@Root() article: Article): Feed {
    const feed = this.articlesMock.find((a) => a.id === article.id)?.feed;
    if (feed) {
      return feed;
    } else {
      throw new Error(
        `Internal Error Article with ID ${article.id} has invalid Format`
      );
    }
  }

  @FieldResolver((_type) => Feed)
  categories(@Root() article: Article): Category[] {
    const categories = this.articlesMock.find(
      (a) => a.id === article.id
    )?.categories;
    if (categories) {
      return categories;
    } else {
      return [];
    }
  }

  @Query((_returns) => [Article])
  getArticles(): Promise<Article[]> {
    return Promise.resolve(this.articlesMock);
  }

  @Query((_returns) => Article)
  getArticle(@Arg("id") id: number): Promise<Article> {
    return Promise.resolve(
      this.articlesMock.filter((articlesMock) => articlesMock.id === id)[0]
    );
  }
}
