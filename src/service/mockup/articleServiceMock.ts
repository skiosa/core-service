import { shuffle } from "shuffle-seed";
import { Article, Author, Category, Feed } from "skiosa-orm";
import { Arg, FieldResolver, Query, Resolver, Root, Int } from "type-graphql";
import { PaginationArg } from "../../model/paginationArg";
import { ArticleService } from "../articleService";
import { MockService } from "./mockService";
import { paginate } from "../../util/paginate";
import { UserInfo } from "../../model/jwt";

@Resolver(Article)
export class ArticleServiceMock extends MockService implements ArticleService {

  @Query((_of) => [Article])
  recommendedArticles(
    @Arg("seed") seed: number,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    return new Promise<Article[]>((resolve, reject) => {
      try {
        resolve(paginate(shuffle(this.articlesMock, seed), paginated));
      } catch (e) {
        reject(e);
      }
    });
  }

  @FieldResolver((_of) => Author)
  author(@Root() article: Article): Promise<Author> {
    const a = this.articlesMock.find((articlesMock) => articlesMock.id === article.id);
    if (a && a.author) {
      return Promise.resolve(a.author);
    } else {
      throw new Error(`Internal Error Article with ID ${article.id} has invalid Format`);
    }
  }

  @Query((_returns) => [Article])
  similarArticles(
    @Arg("articleId") articleId: number,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    return this.recommendedArticles(articleId, paginated);
  }

  @FieldResolver((_of) => Feed)
  feed(@Root() article: Article): Promise<Feed> {
    const feed = this.articlesMock.find((a) => a.id === article.id)?.feed;
    if (feed) {
      return Promise.resolve(feed);
    } else {
      throw new Error(`Internal Error Article with ID ${article.id} has invalid Format`);
    }
  }

  @FieldResolver((_of) => Category)
  categories(@Root() article: Article): Promise<Category[]> {
    const categories = this.articlesMock.find((a) => a.id === article.id)?.categories;
    return Promise.resolve(categories ?? []);
  }

  @FieldResolver((_of) => Int)
  categoryCount(@Root() article: Article): Promise<number> {
    const categories = this.articlesMock.find((a) => a.id === article.id)?.categories;
    return Promise.resolve(categories?.length ?? 0);
  }

  @FieldResolver((_of) => Int)
  likeCount(@Root() article: Article): Promise<number> {
    return Promise.resolve(
      this.articlesMock.find((articlesMock) => articlesMock.id === article.id)?.likes?.length ?? 0
    );
  }

  @FieldResolver((_of) => Int)
  bookmarkCount(@Root() article: Article): Promise<number> {
    return Promise.resolve(
      this.articlesMock.find((articlesMock) => articlesMock.id === article.id)?.bookmarks?.length ?? 0
    );
  }

  @Query((_returns) => [Article])
  articles(@Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg): Promise<Article[]> {
    return Promise.resolve(paginate(this.articlesMock, paginated));
  }

  @Query((_returns) => Article)
  article(@Arg("id") id: number): Promise<Article> {
    const article = this.articlesMock.find((articlesMock) => articlesMock.id === id);
    if (article) {
      return Promise.resolve(article);
    } else {
      throw new Error(`Article with id: ${id} not found!`);
    }
  }

  bookmarkStatus(currentUserInfo: UserInfo, article: Article): Promise<boolean> {
    console.log(currentUserInfo);
    console.log(article);
    throw new Error("Method not implemented.");
  }
}
