import { __Type } from "graphql";
import { dataSource } from "skiosa-orm/lib/db";
import { Article } from "skiosa-orm/lib/model/article";
import { Arg, FieldResolver, Query, Resolver, Root, ID, Int } from 'type-graphql';
import { ArticleService } from "../articleService";
import { Author } from 'skiosa-orm/lib/model/author';
import { Feed } from 'skiosa-orm/lib/model/feed';
import { Category } from 'skiosa-orm/lib/model/category';
import { Like } from "typeorm";
import { User } from 'skiosa-orm';

@Resolver(Article)
export class ArticleServiceImpl implements ArticleService {
  @Query((_returns) => [Article])
  articles(
    //@Arg("PaginationArg", { nullable: true }) paginated?: PaginationArg
    ): Promise<Article[]> {
    const articleRepository = dataSource.getRepository(Article);
    return new Promise((resolve, reject) => {
      articleRepository
        .find()
        .then((articles) => resolve(articles))
        .catch((err) => reject(err));
    });
  }

  @Query((_returns) => Article)
  article(@Arg("id") id: number): Promise<Article> {
    const articleRepository = dataSource.getRepository(Article);
    return new Promise((resolve, reject) => {
      articleRepository
        .findOneBy({ id: id })
        .then((article) => {
          if (article) {
            resolve(article);
          } else {
            reject(null);
          }
        })
        .catch((err) => reject(err));
    });
  }

  @FieldResolver(__Type => Author)
  author(@Root() article: Article) :Promise<Author> {
    return dataSource.getRepository(Article).findOne({
      relations: ["author"],
      where: {
        id : article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else if (!a.author) {
        throw new Error(`Article with id: ${article.id} has invalid format!`);
      }
      else {
        return a.author
      }
    })
  }

  @FieldResolver(__Type => Feed)
  feed(@Root() article: Article) :Promise<Feed> {
    return dataSource.getRepository(Article).findOne({
      relations: ["feed"],
      where: {
        id: article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else if (!a.feed) {
        throw new Error(`Article with id: ${article.id} has invalid format!`);
      }
      else {
        return a.feed
      }
    })
  }

  @FieldResolver(__Type => Category)
  categories(
    @Root() article:Article,
    //@Arg("paginationArg", { nullable: true }) paginated?: PaginationArg
    ) : Promise<Category[]> {
    return dataSource.getRepository(Article).findOne({
      relations: ["categories"],
      where: {
        id: article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else if (!a.categories) {
        throw new Error(`Article with id: ${article.id} has invalid format!`);
      }
      else {
        const categories = a.categories || [];
        /*
          if (paginated) {
            return categories.slice(paginated.skip || 0, (paginated.skip || 0) + paginated.take);
          }
        */
        return categories
      }
    })
  }

  @FieldResolver(__Type => Int)
  categoryCount(@Root() article:Article) : Promise<number> {
    return dataSource.getRepository(Article).findOne({
      relations: ["categories"],
      where: {
        id: article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else if (!a.categories) {
        throw new Error(`Article with id: ${article.id} has invalid format!`);
      }
      else {
        return a.categories.length
      }
    })
  }

  @FieldResolver(__Type => User)
  likes(@Root() article:Article) : Promise<User[]> {
    return dataSource.getRepository(Article).findOne({
      relations: ["likes"],
      where: {
        id: article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else {
        const likes = a.likes ?? [];
        /*
          if (paginated) {
            return likes.slice(paginated.skip || 0, (paginated.skip || 0) + paginated.take);
          }
        */
        return likes
      }
    })
  }

  @FieldResolver(__Type => Int)
  likesCount(@Root() article:Article) : Promise<number> {
    return dataSource.getRepository(Article).findOne({
      relations: ["likes"],
      where: {
        id: article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else {
        //array can be empty: count 0
        return (a.likes ?? []).length
      }
    })
  }

  @FieldResolver(__Type => User)
  bookmarks(@Root() article: Article) : Promise<User[]> {
    return dataSource.getRepository(Article).findOne({
      relations: ["bookmarks"],
      where: {
        id: article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else {
        const bookmarks = a.bookmarks ?? [];
        /*
          if (paginated) {
            return likes.slice(paginated.skip || 0, (paginated.skip || 0) + paginated.take);
          }
        */
        return bookmarks
      }
    })
  }

  @FieldResolver(__Type => User)
  bookmarksCount(@Root() article: Article) : Promise<number> {
    return dataSource.getRepository(Article).findOne({
      relations: ["bookmarks"],
      where: {
        id: article.id
      }
    }).then((a) => {
      if (!a) {
        throw new Error(`Article with id: ${article.id} not found!`);
      }
      else {
        return (a.bookmarks ?? []).length
      }
    })
  }

}
