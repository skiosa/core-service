import { Article, Category, Feed, User } from "skiosa-orm";
import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { PaginationArg } from "../../model/paginationArg";
import { FeedService } from "../feedService";
import { MockService } from "./mockService";

@Resolver((_of) => Feed)
export class FeedResolverServiceMock
  extends MockService
  implements FeedService {
  categories(feed: Feed, paginated?: PaginationArg): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }
  categoryCount(feed: Feed): Promise<number> {
    throw new Error("Method not implemented.");
  }
  subscribers(feed: Feed, paginated?: PaginationArg): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  subscriberCount(feed: Feed): Promise<number> {
    throw new Error("Method not implemented.");
  }
  @Query((_of) => [Feed])
  feeds(
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Feed[]> {
    if (!paginated) {
      return Promise.resolve(this.feedMock);
    } else {
      return Promise.resolve(
        this.feedMock.slice(
          paginated.skip,
          (paginated.skip || 0) + paginated.take
        )
      );
    }
  }

  @Query((_of) => Feed)
  feed(@Arg("id") id: number): Promise<Feed> {
    const feed = this.feedMock.find((f) => f.id === id);
    if (!feed) {
      throw new Error(`Feed with id ${id} not found`);
    }
    return Promise.resolve(feed);
  }

  @FieldResolver((_of) => [Article])
  articles(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    if (!paginated) {
      return Promise.resolve(
        this.articlesMock.filter((a) => a.feed?.id === feed.id)
      );
    } else {
      return Promise.resolve(
        this.articlesMock
          .filter((a) => a.feed?.id === feed.id)
          .slice(paginated.skip, (paginated.skip || 0) + paginated?.take)
      );
    }
  }

  @FieldResolver((_of) => Int)
  articleCount(@Root() feed: Feed): Promise<number> {
    return Promise.resolve(
      this.articlesMock.filter((a) => a.feed?.id === feed.id).length
    );
  }
}
