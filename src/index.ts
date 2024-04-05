import dotenv from "dotenv";
import { connectRedis } from "./lib/redis";
import AppDataSource from "./database/datasource";
import logger from "./lib/logger";
import config from "./config";
import app from "./app";

import "reflect-metadata";
import { clearCacheByVersion } from "./lib/utils";

dotenv.config(); // Load environment variables

const port = config.port;

async function main() {
  try {
    // Attempt to connect to Redis with retries
    await connectRedis();

    // Clear cache of a specific version at start
    await clearCacheByVersion("search");
    logger.info("Cache cleared for version search.");

    // Initialize database connection
    await AppDataSource.initialize();
    logger.info("Connected to the database.");

    // Start the express server
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Failed to start the server:", error);
    process.exit(1);
  }
}

// Call the function to start everything
main();
