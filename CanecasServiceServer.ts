import {mongoConnect} from "./src/database/mongo";
import logger from "./src/utils/Logger";
import app from "./src/api/api";
import express from "express";
import path from "path";

const PORT = process.env.SERVER_PORT || 3500;
export const imagesPath = __dirname + "/images/";

const start = async () => {
  await mongoConnect();

  // setup client path
  app.use("/api", express.static(__dirname));
  app.use(express.static(__dirname + "/public/"));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(PORT, () => {
    return logger.info(`Express is listening at http://localhost:${PORT}`);
  });
}

start();