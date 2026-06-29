import mongoose from "mongoose";
import { env } from "./Env";
import { Logger } from "../utils/Logger";

let cachedDbConnection: typeof mongoose | null = null;

export const connectDB = async () => {
    if (cachedDbConnection) {
        return cachedDbConnection;
    }
    try {
        cachedDbConnection = await mongoose.connect(env.MONGO_URI);
        Logger.info(`[Success]: MongoDB connected successfully`);
        return cachedDbConnection;
    } catch (error) {
        Logger.error(`[Error]: MongoDB connection failed: ${error}`);
        throw error;
    }
};
