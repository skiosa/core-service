import { dataSource } from 'skiosa-orm/lib/db';
import { initDB } from "./util/initDB";

dataSource
    .initialize()
    .then(() => initDB())
    .then(() => {
        console.log("Database initialized");
    })
    .catch((err: any) => console.error(err));