import {mongoConnect} from "./src/database/mongo";
import logger from "./src/utils/Logger";
import app from "./src/api/api";
import express from "express";
import path from "path";

const PORT = process.env.SERVER_PORT || 3500;
export const imagesPath = __dirname + "/public/images/";

const start = async () => {
  await mongoConnect();

  app.use("/api", express.static(path.join(__dirname, "public")));
  app.listen(PORT, () => {
    return logger.info(`Express is listening at http://localhost:${PORT}`);
  });
}

start();