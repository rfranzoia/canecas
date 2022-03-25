import {createConnection} from "typeorm";
import logger from "../Logger";

createConnection().then(() => logger.info("database connected"));