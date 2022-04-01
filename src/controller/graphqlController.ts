import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const router = express.Router();

/**
 * Main GraphQL Schema
 */
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    hello: () => {
        return 'Hello world!';
    },
};

router.use("/", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

export { router as graphqlController }