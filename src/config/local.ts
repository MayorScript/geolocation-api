import { format, transports } from "winston";

module.exports = {
  port: process.env.NODE_PORT || 3000,
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  database: {
    type: process.env.DATABASE_DRIVER || "postgres", // mysql/mariadb, sqlite
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "<PASSWORD>",
    database: process.env.DATABASE_NAME || "postgres",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
  logging: {
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.File({ filename: "./logs/logs.log" }),
      new transports.Console(),
    ],
  },
};
