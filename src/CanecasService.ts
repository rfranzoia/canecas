import {mongoConnect} from "./database/mongo";
import logger from "./utils/Logger";
import app from "./api/api";

const PORT = process.env.SERVER_PORT || 3500;
export const imagesPath = __dirname + "/../images/";

const start = async () => {
  await mongoConnect();

  app.listen(PORT, () => {
    return logger.info(`Express is listening at http://localhost:${PORT}`);
  });
}

start();