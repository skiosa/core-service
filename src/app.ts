import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { defaultController } from "./controller/defaultController";
import { errorController } from "./controller/errorController";
import { graphqlController } from "./controller/graphqlController";
import { dataSource } from "skiosa-orm/lib/db";

/**
 * Configuration Part
 */
dotenv.config({ path: "./src/config/app.env" });

/**
 * Database Setup
 */
dataSource
  .initialize()
  .catch((err: any) => console.error(err));

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
 * Express Routes
 */
api.use("/", defaultController);
api.use("/graphql", graphqlController);
api.use('*', errorController);

/**
 * Security Configuration
 */
api.disable("x-powered-by");
