import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/Logger";

dotenv.config({ path: "./.env" });

const MONGO_URL = process.env.MONGO_URL || "";

mongoose.connection.once('open', () => {
    logger.info("MongoDB connection ready!");
});

mongoose.connection.on('error', (err) => {
    logger.error(err);
});

async function mongoConnect() {
    await mongoose.connect( MONGO_URL );
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect }