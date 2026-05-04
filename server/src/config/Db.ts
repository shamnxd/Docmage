import mongoose from "mongoose";
import { env } from "./Env.js";
import { Logger } from "../utils/Logger.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        Logger.info(`[Success]: MongoDB connected successfully`);
    } catch (error) {
        Logger.error(`[Error]: MongoDB connection failed: ${error}`);
        process.exit(1);
    }
};
