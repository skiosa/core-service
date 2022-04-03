import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article";

@Entity()
@ObjectType()
@InputType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: number;

  @Column()
  @Field((type) => String)
  name!: string;

  @ManyToMany(() => Article, (article) => article.category)
  @Field((type) => [Article])
  articles?: Article[];
}
