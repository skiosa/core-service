import { Feed } from "skiosa-orm";
import { Field, Int, InputType } from "type-graphql";
import { GraphQLURL } from "graphql-custom-types";

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
