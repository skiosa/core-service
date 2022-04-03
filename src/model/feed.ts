import { Field, ObjectType, ID, InputType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article";

@Entity()
@ObjectType()
export class Feed {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: number;

  @Column()
  @Field((type) => String)
  link!: string;

  @Column()
  @Field((type) => String)
  ttl!: number;

  @OneToMany(() => Article, (article) => article.id)
  @Field((type) => [Article])
  articles?: Article[];
}

@InputType()
export class FeedInput implements Partial<Feed> {
  @Field((type) => ID)
  id!: number;

  @Field((type) => String)
  link!: string;

  @Field((type) => String)
  ttl!: number;
}
