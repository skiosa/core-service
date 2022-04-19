import { Field, ObjectType } from "type-graphql";

export interface UserInfo {
  id: string | undefined;
  email: string | undefined;
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

/**
 * @author LukasLJL
 * @summary UserInfo Object which Stores the information of the user
 * @description After a User has been authenticated, the information of the user is stored in this object. The Content from this object is been transformed from a JWT Token.
 */
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
