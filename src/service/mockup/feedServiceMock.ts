import { Article, Feed } from "skiosa-orm";
import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { PaginationArg } from "../../model/paginationArg";
import { FeedService } from "../feedService";
import { MockService } from "./mockService";

@Resolver((_of) => Feed)
export class FeedServiceMock
  extends MockService
  implements FeedService
{
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
