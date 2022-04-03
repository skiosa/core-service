import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { ArticleServiceMock } from "../service/mockup/articleServiceMock";

const router = express.Router();

bootstrap();

async function bootstrap() {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [ArticleServiceMock],
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  /**
   * Main GraphQL Route to Serve GraphQL
   */
  router.use(
    "/",
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    })
  );
}

export { router as graphqlController };
