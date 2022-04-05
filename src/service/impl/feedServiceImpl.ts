import { Resolver, Query, FieldResolver, Root, Arg, ID } from "type-graphql";
import { Article, Feed } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";
import { count } from "console";
import { PaginationArg } from "../../model/paginationArg";
import { FeedService } from "../feedService";

@Resolver((_of) => Feed)
export class FeedResolverService implements FeedService {
  @Query(() => [Feed])
  async feeds(
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Feed[]> {
    return dataSource.getRepository(Feed).find({
      relations: [],
      skip: paginated?.skip,
      take: paginated?.take,
      order: { id: "DESC" },
    });
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

  @FieldResolver()
  async articles(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    return dataSource.getRepository(Article).find({
      relations: [],
      where: {
        feed: feed,
      },
      skip: paginated?.skip,
      take: paginated?.take,
      order: { id: "DESC" },
    });
  }

  @FieldResolver()
  async articleCount(@Root() feed: Feed): Promise<number> {
    return dataSource.getRepository(Article).count({
      where: {
        feed: feed,
      },
    });
  }
}
