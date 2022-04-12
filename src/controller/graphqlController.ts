import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { FeedResolverService } from "../service/impl/feedServiceImpl";
import { ArticleServiceMock } from "../service/mockup/articleServiceMock";

const router = express.Router();

//Starts the main GraphQL Function
bootstrap();

/**
 * @author LukasLJL
 * @summary main graphql function
 * @description Initialize the GraphQL Types and Resolvers, also manages the GraphQL Route
 * @route   GET /graphql
 * @access  Public
 */
async function bootstrap() {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [ArticleServiceMock, FeedResolverService],
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Main GraphQL Route to Serve GraphQL
  router.use(
    "/",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  );
}

export { router as graphqlController };
