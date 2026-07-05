import { createClient } from "redis";
import { env } from "./Env";
import { Logger } from "../utils/Logger";
const redisClient = createClient({
  url: env.REDIS_URL,
});
redisClient.on('error', (err) => Logger.error(`Redis Error: ${err}`));
redisClient.on('connect', () => Logger.info('Redis connected successfully'));
export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
export default redisClient;