import dotenv from 'dotenv';
import express from 'express';
import "reflect-metadata";
import { articleController } from './controller/articleController';
import { defaultController } from './controller/defaultController';
import { graphqlController } from './controller/graphqlController';
import { dataSource } from './datalayer/db';

/**
 * Configuration Part
 */
dotenv.config({ path: './src/config/app.env' });


/**
 * Express Configuration
 */
const api = express();

api.listen(process.env.API_PORT, () => {
    console.log(`Core-Service running at http://localhost:${process.env.API_PORT}`)
});

/**
 * Express Routes
 */
api.use("/", defaultController);
api.use("/article", articleController);
api.use("/graphql", graphqlController);


/**
 * Database Setup
 */
dataSource.initialize().catch((err) => console.error(err));