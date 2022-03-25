import "reflect-metadata";
import './database'
import app from "./api/api";
import dotenv from "dotenv";
import logger from "./Logger";

dotenv.config({ path: "./.env" });
const port = process.env.PORT;

app.listen(port, () => {
  return logger.info(`Express is listening at http://localhost:${port}`);
});

