import Bull from "bull";
import config from "../config";
import { uploadCSVProcess } from "../processes/upload.process";

const csvQueue = new Bull("csv-processing", {
  redis: { host: config.redis.host, port: config.redis.port },
});

csvQueue.process(uploadCSVProcess);

const processCsvFile = (filePath: string) => {
  csvQueue.add({ filePath });
};

export { processCsvFile };
