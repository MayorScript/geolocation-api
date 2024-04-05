import config from "../config";
import { Location } from "../entities/location.entity";
import { DataSource } from "typeorm";

const { type, host, port, username, password, database } = config.database;

const AppDataSource = new DataSource({
  type,
  host,
  port,
  username,
  password,
  database,
  entities: [Location],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
