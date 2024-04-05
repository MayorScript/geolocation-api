import { Job } from "bull";
import { parse } from "csv-parse";
import fs from "fs";
import fsPromises from "fs/promises";
import { Location } from "../entities/location.entity";
import AppDataSource from "../database/datasource";
import logger from "../lib/logger";
import { Repository } from "typeorm";

export const uploadCSVProcess = async (job: Job) => {
  try {
    const { filePath } = job.data;
    const repo = AppDataSource.manager.getRepository(Location);

    // Fetch current data
    const existingLocations = await fetchCurrentData(repo);
    const existingLocationsMap = new Map(
      existingLocations.map((loc: any) => [loc.uniqueIdentifier, loc]),
    );

    // Prepare batch operations
    const locationsToInsert = [];
    const locationsToUpdate = [];

    // Process CSV
    const stream = fs.createReadStream(filePath);
    const parser = stream.pipe(
      parse({ columns: true, skip_empty_lines: true }),
    );

    for await (const record of parser) {
      const existingLocation = existingLocationsMap.get(
        record.uniqueIdentifier,
      );
      if (existingLocation) {
        // Update logic (if any field has changed)
        Object.assign(existingLocation, record);
        locationsToUpdate.push(existingLocation);
      } else {
        // Insert new location
        locationsToInsert.push(record);
      }
    }

    // Batch Insert/Update
    if (locationsToInsert.length) {
      await repo.save(locationsToInsert); // Insert new records
    }
    if (locationsToUpdate.length) {
      await repo.save(locationsToUpdate); // Update existing records
    }

    logger.info(
      `Processed CSV: ${locationsToInsert.length} inserts, ${locationsToUpdate.length} updates.`,
    );

    await fsPromises.unlink(filePath);
    logger.info(`CSV file deleted: ${filePath}`);
  } catch (error: any) {
    logger.error("Error while processing CSV:", error);
  }
};

const fetchCurrentData = async (repo: Repository<Location>) => {
  return await repo.createQueryBuilder("location").getMany();
};
