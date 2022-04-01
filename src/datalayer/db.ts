import { DataSource } from "typeorm";
import { Article } from "../model/article";
import { Author } from "../model/author";
import { Feed } from "../model/feed";
import { Category } from '../model/category';


export const dataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT!),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [Article, Author, Feed, Category],
    subscribers: [],
    migrations: [],
});