import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PaginationArg {
    @Field(_type => Int)
    take!: number;
    @Field(_type => Int)
    skip!: number;

}