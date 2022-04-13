import { shuffle } from "shuffle-seed";
import { Article, Author, Category, Feed, User } from "skiosa-orm";
import { Arg, FieldResolver, Query, Resolver, Root, Int, Field } from 'type-graphql';
import { PaginationArg } from "../../model/paginationArg";
import { ArticleService } from "../articleService";
import { MockService } from "./mockService";
import { paginate } from "../../util/paginate";
import { __Type } from 'graphql';

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

  @FieldResolver((_type) => Author)
  author(@Root() article: Article): Promise<Author> {
    return Promise.resolve(article.author as Author);
  }

  @FieldResolver((_type) => Feed)
  feed(@Root() article: Article): Promise<Feed> {
    const feed = this.articlesMock.find((a) => a.id === article.id)?.feed;
    if (feed) {
      return Promise.resolve(feed);
    } else {
      throw new Error(`Internal Error Article with ID ${article.id} has invalid Format`);
    }
  }

  @FieldResolver((_type) => Category)
  categories(@Root() article: Article): Promise<Category[]> {
    const categories = this.articlesMock.find((a) => a.id === article.id)?.categories;
    if (categories) {
      return Promise.resolve(categories);
    } else {
      return Promise.resolve([]);
    }
  }

  @FieldResolver(__Type => Int)
  categoryCount(article: Article): Promise<number> {
    const categories = this.articlesMock.find((a) => a.id === article.id)?.categories;
    if (categories) {
      return Promise.resolve(categories.length);
    } else {
      return Promise.resolve(0);
    }
  }
  
  @FieldResolver(__Type => Int)
  likeCount(article: Article): Promise<number> {
    return Promise.resolve(0);
  }
  
  @FieldResolver(__Type => Int)
  bookmarkCount(article: Article): Promise<number> {
    return Promise.resolve(0);
  }

  @Query((_returns) => [Article])
  articles(): Promise<Article[]> {
    return Promise.resolve(this.articlesMock);
  }

  @Query((_returns) => Article)
  article(@Arg("id") id: number): Promise<Article> {
    return Promise.resolve(this.articlesMock.filter((articlesMock) => articlesMock.id === id)[0]);
  }
}
