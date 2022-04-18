import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageLocalDefault, Context } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import http from 'http';
import KeycloakConnect from "keycloak-connect";
import { KeycloakContext } from "keycloak-connect-graphql";
import "reflect-metadata";
import { dataSource } from "skiosa-orm/lib/db";
import { buildSchema } from "type-graphql";
import { defaultController } from "./controller/defaultController";
import { errorController } from "./controller/errorController";
import { UserInfo } from "./model/jwt";
import { FeedServiceImpl } from "./service/impl/feedServiceImpl";
import { UserInfoServiceImpl } from "./service/impl/userInfoServiceImpl";
import { ArticleServiceMock } from "./service/mockup/articleServiceMock";
import { authChecker, userInfo } from './util/middelwares';

/**
 * Configuration Part
 */
dotenv.config({ path: "./src/config/app.env" });

/**
 * Database Initialization & Server Startup
 */
dataSource.initialize()
  .then(() => startApolloServer())
  .catch((err: any) => console.error(err));

declare module "express-serve-static-core" {
  interface Request {
    UserInfo?: UserInfo;
  }
}

async function startApolloServer() {
  /**
   * Express Configuration
   */
  const app = express();

  /**
   * Session Store Configuration
   */
  const memoryStore = new session.MemoryStore();
  app.use(
    session({
      secret: process.env.MEMORYSTORE_SECRET || "secret",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

  /**
   * Keycloak Configuration
   */
  const keycloak = new KeycloakConnect(
    { store: memoryStore },
    {
      "auth-server-url": process.env.KEYCLOAK_URL || "http://localhost:5000/auth",
      realm: process.env.KEYCLOAK_REALM || "skiosa-test",
      resource: process.env.KEYCLOAK_RESOURCE || "skiosa-core-service",
      "confidential-port": process.env.KEYCLOAK_PORT || "443",
      "ssl-required": "true",
      "bearer-only": true,
    }
  );

  /**
   * Express Middleware
   */
  app.use(keycloak.middleware());

  /**
   * Security Configuration
   */
  app.disable("x-powered-by");


  /**
   * GraphQL Schema Builder
   */
  const schema = await buildSchema({
    resolvers: [ArticleServiceMock, FeedServiceImpl, UserInfoServiceImpl],
    authChecker: authChecker,
  });

  /**
   * Apollo Server Configuration
   */
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: schema,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageLocalDefault(),
    ],
    context: ({ req }) => {
      const ctx: Context = {
        kauth: new KeycloakContext({ req: req as any }, keycloak),
        userInfo: userInfo(new KeycloakContext({ req: req as any }, keycloak)),
      };
      return ctx;
    }
  });
  await server.start();

  /**
   * Express Routes
   */
  app.use("/", defaultController);
  server.applyMiddleware({ app, path: "/graphql" })
  app.use("*", errorController);

  /**
   * Launch HTTP Server
   */
  await new Promise<void>(resolve => httpServer.listen({ port: process.env.API_PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.API_PORT}${server.graphqlPath}`);
}
