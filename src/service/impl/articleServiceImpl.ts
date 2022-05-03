import { shuffle } from "shuffle-seed";
import { Article, Feed } from "skiosa-orm";
import { dataSource } from "skiosa-orm/lib/db";
import { Arg, FieldResolver, Query, Resolver, Root, Int, Authorized } from "type-graphql";
import { ArticleService } from "../articleService";
import { Author } from "skiosa-orm/lib/model/author";
import { Category } from "skiosa-orm/lib/model/category";
import { paginate } from "../../util/paginate";
import { PaginationArg } from "../../model/paginationArg";
import { UserInfo } from "../../model/jwt";
import { CurrentUser } from "../../model/context";

@Resolver(Article)
export class ArticleServiceImpl implements ArticleService {
  @Query((_returns) => [Article])
  articles(@Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg): Promise<Article[]> {
    return dataSource.getRepository(Article).find({
      relations: [],
      skip: paginated?.skip,
      take: paginated?.take,
      order: { id: "ASC" },
    });
  }

  @Query((_of) => [Article])
  recommendedArticles(@Arg("seed") seed: number, @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg) {
    return dataSource
      .getRepository(Article)
      .find({
        relations: [],
        order: { id: "ASC" },
      })
      .then((articles) => shuffle(articles, seed))
      .then((articles) => paginate(articles, paginated));
  }
  @Query((_returns) => [Article])
  similarArticles(
    @Arg("articleId") articleId: number,
    @Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Article[]> {
    return this.recommendedArticles(articleId, paginated);
  }

  @Query((_returns) => Article)
  article(@Arg("id") id: number): Promise<Article> {
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: [],
        where: {
          id: id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${id} not found!`);
        }
        return a;
      });
  }

  @FieldResolver((_of) => Author)
  author(@Root() article: Article): Promise<Author> {
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["author"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else if (!a.author) {
          throw new Error(`Article with id: ${article.id} has invalid format!`);
        } else {
          return a.author;
        }
      });
  }

  @FieldResolver((_of) => Category)
  categories(
    @Root() article: Article,
    @Arg("paginationArg", { nullable: true }) paginated?: PaginationArg
  ): Promise<Category[]> {
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["categories"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else {
          const categories = a.categories || [];
          return paginate(categories, paginated);
        }
      });
  }

  @FieldResolver((__Type) => Int)
  categoryCount(@Root() article: Article): Promise<number> {
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["categories"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else {
          return a.categories?.length ?? 0;
        }
      });
  }

  @FieldResolver((__Type) => Int)
  likeCount(@Root() article: Article): Promise<number> {
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["likes"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else {
          //array can be empty: count 0
          return a.likes?.length ?? 0;
        }
      });
  }

  @FieldResolver((__Type) => Boolean)
  @Authorized("realm:skiosa-user", "PUBLIC")
  likeStatus(@CurrentUser() currentUserInfo: UserInfo, @Root() article: Article): Promise<boolean> {
    if (!currentUserInfo) {
      return Promise.resolve(false);
    }
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["likes"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else {
          return a.likes?.some((userLikes) => userLikes.id === currentUserInfo.id) ?? false;
        }
      });
  }

  @FieldResolver((__Type) => Int)
  bookmarkCount(@Root() article: Article): Promise<number> {
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["bookmarks"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else {
          return a.bookmarks?.length ?? 0;
        }
      });
  }

  @FieldResolver((__Type) => Boolean)
  @Authorized("realm:skiosa-user", "PUBLIC")
  bookmarkStatus(@CurrentUser() currentUserInfo: UserInfo, @Root() article: Article): Promise<boolean> {
    if (!currentUserInfo) {
      return Promise.resolve(false);
    }
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["bookmarks"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else {
          return a.bookmarks?.some((userBookmark) => userBookmark.id === currentUserInfo.id) ?? false;
        }
      });
  }

  @FieldResolver((_returns) => Feed)
  feed(@Root() article: Article): Promise<Feed> {
    return dataSource
      .getRepository(Article)
      .findOne({
        relations: ["feed"],
        where: {
          id: article.id,
        },
      })
      .then((a) => {
        if (!a) {
          throw new Error(`Article with id: ${article.id} not found!`);
        } else if (!a.feed) {
          throw new Error(`Article with id: ${article.id} has invalid format!`);
        }
        return a.feed;
      });
  }
}
