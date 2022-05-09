import { Article, Category, Feed, User } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";
import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { DeleteResult } from "typeorm";
import { FeedInput } from "../../model/models";
import { PaginationArg } from "../../model/paginationArg";
import { paginate } from "../../util/paginate";
import { FeedService } from "../feedService";

@Resolver((_of) => Feed)
export class FeedServiceImpl implements FeedService {
  @Query((_returns) => [Feed])
  async feeds(@Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg): Promise<Feed[]> {
    return dataSource.getRepository(Feed).find({
      relations: [],
      skip: paginated?.skip,
      take: paginated?.take,
      order: { id: "ASC" },
    });
  }

  @Query((_returns) => [Feed])
  async recommendedFeeds(
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Feed[]> {
    return dataSource
      .getRepository(Feed)
      .createQueryBuilder('feed')
      .take(paginated?.take)
      .orderBy('RANDOM()')
      .getMany();
  }

  @Query((_returns) => Feed)
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

  @FieldResolver((_of) => [Article])
  articles(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg,
    @Arg("Desc", { nullable: true }) desc?: boolean
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
      order: { publishedAt: desc ? "DESC" : "ASC" },
    });
  }

  @FieldResolver((_of) => Int)
  async articleCount(@Root() feed: Feed): Promise<number> {
    return dataSource.getRepository(Article).count({
      where: {
        feed: feed,
      },
    });
  }

  @FieldResolver((_of) => [Category])
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

  @FieldResolver((_of) => Int)
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

  @FieldResolver((_of) => [User])
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

  @FieldResolver((_of) => Int)
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

  @Mutation(() => Feed)
  @Authorized("realm:skiosa-user")
  createFeed(@Arg("feed") feed: FeedInput): Promise<Feed> {
    return dataSource.getRepository(Feed).save(feed);
  }

  @Mutation(() => String)
  @Authorized("realm:skiosa-admin")
  deleteFeed(@Arg("feedId") feedId: number): Promise<string> {
    return dataSource
      .getRepository(Article)
      .delete({ feed: { id: feedId } })
      .then(() => {
        return dataSource
          .getRepository(Feed)
          .delete({ id: feedId })
          .then((result: DeleteResult) => {
            if (result.affected === 0) {
              throw new Error(`Feed with id ${feedId} not found`);
            } else {
              return `Feed with the id ${feedId} was deleted.`;
            }
          });
      });
  }
}
