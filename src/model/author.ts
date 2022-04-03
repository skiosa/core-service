import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article";

@Entity()
@ObjectType()
export class Author {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: number;

  @Column()
  @Field((type) => String)
  name!: string;

  @OneToMany(() => Article, (article) => article.id)
  @Field((type) => [Article])
  article?: Article[];
}

@InputType()
export class AuthorInput implements Partial<Author> {
  @Field((type) => ID)
  id!: number;

  @Field((type) => String)
  name!: string;
}
