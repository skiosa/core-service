import { exit } from "process";
import { dataSource } from "skiosa-orm/lib/db";
import { initDB } from "./util/initDB";

dataSource
  .initialize()
  .then(() => initDB())
  .then(() => {
    console.log("Database initialized");
    exit(0);
  })
  .catch((err: any) => {
    console.error(err);
    exit(1);
  });
