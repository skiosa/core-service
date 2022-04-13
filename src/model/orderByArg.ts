import { Field, InputType } from "type-graphql";

@InputType()
export class OderByArg {
  @Field((_type) => String)
  field!: string;
  @Field((_type) => Boolean)
  isDesc!: boolean;
}
