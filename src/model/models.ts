import { Category, Feed, User } from "skiosa-orm";
import { Field, Int, InputType } from "type-graphql";
import { GraphQLURL } from "graphql-custom-types";

@InputType()
export class CategoryInput implements Partial<Category> {
  @Field((_type) => String)
  name!: string;
}

@InputType()
export class FeedInput implements Partial<Feed> {
  @Field((_type) => GraphQLURL)
  link!: string;
  @Field((_type) => Int, { nullable: true })
  ttl?: number;
  @Field((_type) => String)
  name!: string;
  @Field((_type) => String, { nullable: true })
  description?: string;
}

@InputType()
export class UserInput implements Partial<User> {
  @Field((_type) => String)
  id!: string;
}
