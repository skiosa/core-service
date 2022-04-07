import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { dataSource } from "skiosa-orm/lib/db";
import { defaultController } from "./controller/defaultController";
import { errorController } from "./controller/errorController";
import { graphqlController } from "./controller/graphqlController";
import expressSession from "express-session";
import KeycloakConnect, { KeycloakConfig } from "keycloak-connect";
import session from "express-session";

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

api.listen(process.env.API_PORT, () => {
  console.log(
    `Core-Service running at http://localhost:${process.env.API_PORT}`
  );
});

/**
 * Keycloak Configuration
 */

var memoryStore = new session.MemoryStore();
var keycloak = new KeycloakConnect(
  { store: memoryStore },
  {
    "auth-server-url": "https://keycloak.skiosa.de/auth",
    realm: "Skiosa",
    resource: "core-service",
    "confidential-port": "443",
    "ssl-required": "true",
    "bearer-only": true,
  }
);

api.use(
  session({
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

api.use(keycloak.middleware());

api.get(
  "/protected",
  keycloak.protect("realm:skiosa-user"),
  function (req, res) {
    console.log("User is authenticated!");
    res.json("Hello User");
  }
);

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
