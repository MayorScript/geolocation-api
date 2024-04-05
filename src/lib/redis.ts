import { createClient } from "redis";
import logger from "./logger";
import config from "../config";

const { host, port } = config.redis;

// Initialize and connect the client immediately
const client = createClient({
  url: `redis://${host}:${port}`,
});

client.on("error", (err) => {
  logger.error("Redis Client Error", err);
  process.exit(1);
});

const connectRedis = async (retries = 5, delay = 2000) => {
  while (retries > 0) {
    try {
      await client.connect();
      logger.info("Connected to Redis.");
      return; // Connection successful
    } catch (error) {
      retries--;
      logger.error(
        `Redis connection failed. Retrying... (${retries} attempts left)`,
        error,
      );
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
  logger.error("Redis connection failed after ${retries} attempts.");
  process.exit(1);
};

// Export the connected client
export { client, connectRedis };
