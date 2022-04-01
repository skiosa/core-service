import dotenv from 'dotenv';
import express from 'express';
import "reflect-metadata";
import { defaultController } from './controller/defaultController';

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

