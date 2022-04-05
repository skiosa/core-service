import { type } from "os";
import { Field, InputType } from "type-graphql";

@InputType()
export class OderByArg {
    @Field(type => String)
    field!: string;
    @Field(type => Boolean)
    isDesc!: boolean;
}