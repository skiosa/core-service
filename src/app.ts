import { Context } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import http from 'http';
import KeycloakConnect from "keycloak-connect";
import { KeycloakContext, KeycloakSchemaDirectives, KeycloakTypeDefs } from "keycloak-connect-graphql";
import "reflect-metadata";
import { dataSource } from "skiosa-orm/lib/db";
import { buildSchema } from "type-graphql";
import { defaultController } from "./controller/defaultController";
import { errorController } from "./controller/errorController";
import { UserInfo } from "./model/jwt";
import { ArticleServiceImpl } from './service/impl/articleServiceImpl';
import { FeedServiceImpl } from "./service/impl/feedServiceImpl";
import { UserInfoServiceImpl } from "./service/impl/userInfoServiceImpl";
import { authChecker, userInfo } from './util/middelwares';

/**
 * Configuration Part
 */
dotenv.config({ path: "./src/config/app.env" });

/**
 * Database Setup
 */
dataSource.initialize().catch((err: any) => console.error(err));

declare module "express-serve-static-core" {
  interface Request {
    UserInfo?: UserInfo;
  }
}


startApolloServer();


async function startApolloServer() {
  /**
   * Express Configuration
   */
  const app = express();

  /**
   * Session Store Configuration
   */
  var memoryStore = new session.MemoryStore();
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
  var keycloak = new KeycloakConnect(
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
   * Express Routes
   */
  app.use("/", defaultController);
  app.use("*", errorController);

  /**
   * Security Configuration
   */
  app.disable("x-powered-by");


  /**
   * GraphQL Schema Builder
   */
  const schema = await buildSchema({
    resolvers: [ArticleServiceImpl, FeedServiceImpl, UserInfoServiceImpl],
    authChecker: authChecker,
  });

  /**
   * Apollo Server Configuration
   */
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: [KeycloakTypeDefs],
    schemaDirectives: KeycloakSchemaDirectives,
    schema,
    context: ({ req }) => {
      const ctx: Context = {
        kauth: new KeycloakContext({ req: req as any }, keycloak), // 3. add the KeycloakContext to `kauth`
        userInfo: userInfo(new KeycloakContext({ req: req as any }, keycloak)), // 4. add the userInfo to `userInfo`
      };
      return ctx;
    }
  });

  await server.start();
  server.applyMiddleware({ app, path: "/" })
  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
