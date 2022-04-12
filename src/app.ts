import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { dataSource } from "skiosa-orm/lib/db";
import { defaultController } from "./controller/defaultController";
import { errorController } from "./controller/errorController";
import { graphqlController } from "./controller/graphqlController";
import KeycloakConnect from "keycloak-connect";
import session from "express-session";
import { UserInfo } from "./model/jwt";

/**
 * Configuration Part
 */
dotenv.config({ path: "./src/config/app.env" });

/**
 * Database Setup
 */
dataSource.initialize().catch((err) => console.error(err));

/**
 * Express Configuration
 */
const api = express();

declare module "express-serve-static-core" {
  interface Request {
    UserInfo?: UserInfo;
  }
}

api.listen(process.env.API_PORT, () => {
  console.log(
    `Core-Service running at http://localhost:${process.env.API_PORT}`
  );
});

/**
 * Session Store Configuration
 */
var memoryStore = new session.MemoryStore();
api.use(
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

api.use(keycloak.middleware());

/**
 * Express Routes
 */
api.use("/", defaultController);
api.use("/graphql", graphqlController);
api.use("*", errorController);

/**
 * Security Configuration
 */
api.disable("x-powered-by");
