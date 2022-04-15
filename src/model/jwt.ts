import { Field, ObjectType } from "type-graphql";

export interface UserInfo {
  id: string | undefined;
  email: string | undefined;
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

@ObjectType()
export class UserInfo implements UserInfo {
  @Field((_type) => String)
  id: string | undefined;
  @Field((_type) => String)
  email: string | undefined;
  @Field((_type) => String)
  username: string | undefined;
  @Field((_type) => String)
  firstName: string | undefined;
  @Field((_type) => String)
  lastName: string | undefined;
}
