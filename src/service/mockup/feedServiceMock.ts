import { shuffle } from "shuffle-seed";
import { Article, Category, Feed, FeedInput, User } from "skiosa-orm";
import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { PaginationArg } from "../../model/paginationArg";
import { FeedService } from "../feedService";
import { paginate } from "../../util/paginate";
import { MockService } from "./mockService";

@Resolver((_of) => Feed)
export class FeedServiceMock extends MockService implements FeedService {
  recommendedFeeds(seed: number, paginated?: PaginationArg): Promise<Feed[]> {
    return new Promise<Feed[]>((resolve, reject) => {
      try {
        resolve(paginate(shuffle(this.feedMock, seed), paginated));
      } catch (e) {
        reject(e);
      }
    });
  }

  @FieldResolver((_of) => [Category])
  categories(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Category[]> {
    return Promise.resolve(paginate(this.feedMock.find((f) => f.id === feed.id)?.categories ?? [], paginated));
  }
  categoryCount(@Root() feed: Feed): Promise<number> {
    return Promise.resolve(this.feedMock.find((f) => f.id === feed.id)?.categories?.length ?? 0);
  }
  subscribers(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<User[]> {
    return Promise.resolve(paginate(this.feedMock.find((f) => f.id === feed.id)?.subscribers ?? [], paginated));
  }
  subscriberCount(@Root() feed: Feed): Promise<number> {
    return Promise.resolve(this.feedMock.find((f) => f.id === feed.id)?.subscribers?.length ?? 0);
  }
  @Query((_of) => [Feed])
  feeds(@Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg): Promise<Feed[]> {
    return Promise.resolve(paginate(this.feedMock, paginated));
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
    return Promise.resolve(
      paginate(
        this.articlesMock.filter((a) => a.feed?.id === feed.id),
        paginated
      )
    );
  }

  @FieldResolver((_of) => Int)
  articleCount(@Root() feed: Feed): Promise<number> {
    return Promise.resolve(this.articlesMock.filter((a) => a.feed?.id === feed.id).length);
  }

  @Mutation()
  createFeed(@Arg("feed") feed: FeedInput): Promise<Feed> {
    const fullFeed: Feed = {
      id: this.feedMock.length + 1,
      link: feed.link,
      ttl: feed.ttl || 187,
      name: feed.name || "default name",
      description: feed.description || "default description",
      categories: [],
      subscribers: [],
    };

    this.feedMock.push(fullFeed);
    return Promise.resolve(fullFeed);
  }

  @Mutation()
  deleteFeed(@Arg("id") id: number): Promise<string> {
    const feed = this.feedMock.find((f) => f.id === id);
    if (!feed) {
      throw new Error(`Feed with id ${id} not found`);
    }
    this.feedMock = this.feedMock.filter((f) => f.id !== id);
    return Promise.resolve("Feed was deleted");
  }
}
