import { Resolver, Query, FieldResolver, Root, Arg, ID } from "type-graphql";
import { PaginationArg } from "../../model/paginationArg";
import { FeedService } from "../feedService";
import { Loader } from "type-graphql-dataloader";
import { Min } from "class-validator";
import { In } from "typeorm";
import DataLoader from "dataloader";
import { Article, Feed } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";

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
  @Loader<{ id: number; paginated?: PaginationArg }, Article[]>((parameter) => {
    return dataSource
      .getRepository(Article)
      .find({
        relations: ["feed"],
        where: {
          feed: { id: In(parameter.map((p) => p.id)) },
        },
      })
      .then((articles) => {
        return parameter.map((p) => {
          const all: Article[] = articles.filter(
            (articles) => articles.feed?.id === p.id
          );
          if (!p.paginated) {
            return all;
          } else {
            return all.slice(
              p.paginated.skip ?? 0,
              (p.paginated.skip ?? 0) + p.paginated.take
            );
          }
        });
      });
  })
  async articles(
    @Root() feed: Feed,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ) {
    return (
      dataloader: DataLoader<
        { id: number; paginated?: PaginationArg },
        Article[]
      >
    ) =>
      dataloader.load({
        id: feed.id,
        paginated: paginated,
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
