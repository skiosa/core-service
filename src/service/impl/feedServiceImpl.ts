import { shuffle } from "shuffle-seed";
import { Article, Category, Feed, User } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";
import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { PaginationArg } from "../../model/paginationArg";
import { paginate } from "../../util/paginate";
import { FeedService } from "../feedService";

@Resolver((_of) => Feed)
export class FeedServiceImpl implements FeedService {
  @Query(() => [Feed])
  async feeds(@Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg): Promise<Feed[]> {
    return dataSource.getRepository(Feed).find({
      relations: [],
      skip: paginated?.skip,
      take: paginated?.take,
      order: { id: "ASC" },
    });
  }

  @Query((_of) => [Feed])
  async recommendedFeeds(
    @Arg("seed") seed: number,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Feed[]> {
    return dataSource
      .getRepository(Feed)
      .find({
        relations: [],
        order: { id: "ASC" },
      })
      .then((feeds) => shuffle(feeds, seed))
      .then((feeds) => paginate(feeds, paginated));
  }

  @Query(() => Feed)
  async feed(@Arg("id") id: number): Promise<Feed> {
    return dataSource
      .getRepository(Feed)
      .findOne({ where: { id: id } })
      .then((feed) => {
        if (!feed) {
          throw new Error(`Feed with id ${id} not found`);
        } else {
          return feed;
        }
      });
  }

  @FieldResolver((_type) => [Article])
  articles(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    return dataSource.getRepository(Article).find({
      relations: ["feed"],
      where: {
        feed: {
          id: feed.id,
        },
      },
      take: paginated?.take,
      skip: paginated?.skip,
      order: { id: "ASC" },
    });
  }

  @FieldResolver((type) => Int)
  async articleCount(@Root() feed: Feed): Promise<number> {
    return dataSource.getRepository(Article).count({
      where: {
        feed: feed,
      },
    });
  }

  @FieldResolver((_type) => [Category])
  categories(
    @Root() feed: Feed,
    @Arg("paginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Category[]> {
    return dataSource
      .getRepository(Feed)
      .findOne({
        relations: ["categories"],
        where: {
          id: feed.id,
        },
      })
      .then((f) => {
        if (!f) {
          throw new Error(`Feed with id ${feed.id} not found`);
        } else {
          const categories = f.categories || [];
          return paginate(categories, paginated);
        }
      });
  }

  @FieldResolver((_type) => Int)
  categoryCount(@Root() feed: Feed): Promise<number> {
    return dataSource
      .getRepository(Feed)
      .findOne({
        relations: ["categories"],
        where: {
          id: feed.id,
        },
      })
      .then((f) => {
        if (!f) {
          throw new Error(`Feed with id ${feed.id} not found`);
        } else {
          return (f.categories || []).length;
        }
      });
  }

  @FieldResolver((_type) => [User])
  subscribers(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<User[]> {
    return dataSource
      .getRepository(Feed)
      .findOne({
        relations: ["subscribers"],
        where: {
          id: feed.id,
        },
      })
      .then((f) => {
        if (!f) {
          throw new Error(`Feed with id ${feed.id} not found`);
        } else {
          const subscribers = f.subscribers || [];
          return paginate(subscribers, paginated);
        }
      });
  }

  @FieldResolver((_type) => Int)
  subscriberCount(@Root() feed: Feed): Promise<number> {
    return dataSource
      .getRepository(Feed)
      .findOne({
        relations: ["subscribers"],
        where: {
          id: feed.id,
        },
      })
      .then((f) => {
        if (!f) {
          throw new Error(`Feed with id ${feed.id} not found`);
        } else {
          return (f.subscribers || []).length;
        }
      });
  }
}
