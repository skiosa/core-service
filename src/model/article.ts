import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Author, AuthorInput } from "./author";
import { Category } from "./category";
import { Feed, FeedInput } from "./feed";

@Entity()
@ObjectType()
export class Article {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id!: number;

  @Column()
  @Field((type) => String)
  title!: string;

  @Column()
  @Field((type) => String)
  description!: string;

  @Column()
  @Field((type) => String)
  url!: string;

  @OneToOne(() => Author)
  @JoinColumn()
  @Field((type) => Author)
  author!: Author;

  @OneToOne(() => Feed)
  @JoinColumn()
  @Field((type) => Feed)
  feed!: Feed;

  @ManyToMany(() => Category, (category) => category.id)
  @JoinTable()
  @Field((type) => [Category])
  category?: Category[];
}

@InputType()
export class ArticleInput implements Partial<Article> {
  @Field((type) => Number)
  id!: number;

  @Field((type) => String)
  title!: string;

  @Field((type) => String)
  description!: string;

  @Field((type) => String)
  url!: string;

  @Field((type) => AuthorInput)
  author!: AuthorInput;

  @Field((type) => FeedInput)
  feed!: FeedInput;
}
