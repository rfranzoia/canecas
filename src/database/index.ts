import {createConnection} from "typeorm";
import logger from "../utils/Logger";

createConnection().then(() => logger.info("database connected"));