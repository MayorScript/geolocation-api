import { Request, Response } from "express";

import AppDataSource from "../database/datasource";
import { Location } from "../entities/location.entity";
import logger from "../lib/logger";
import {
  calculateScore,
  formatLocation,
  isValidCoordinate,
} from "../lib/utils";
import { client } from "../lib/redis";
import { TLocation, TLocationDataResponse } from "../types/location.type";

class GeoSearchService {
  async searchByGeo(query: any): Promise<any> {
    try {
      const q = query.q?.trim();
      const latitude = Number(query.latitude);
      const longitude = Number(query.longitude);

      // General validation error for all parameters
      if (
        !q ||
        isNaN(latitude) ||
        isNaN(longitude) ||
        !isValidCoordinate(latitude, "latitude") ||
        !isValidCoordinate(longitude, "longitude")
      ) {
        throw new Error(
          "Invalid search parameters. Ensure query, latitude, and longitude are correct.",
        );
      }

      return await this.searchData({ q, latitude, longitude });
    } catch (error: any) {
      logger.error("Error while fetching data:", error);
      // General error handling for unexpected errors
      throw new Error(error.message);
    }
  }

  async searchData({ q, latitude, longitude }: TLocation) {
    // Unique key for storing/retrieving cached results
    const cacheKey = `search:${q}:${latitude}:${longitude}`;

    // Fetch cached results
    const cachedResults = await this.#getCachedResults(cacheKey);
    if (cachedResults) {
      return JSON.parse(cachedResults); // Return the cached results after parsing
    }

    // If no cache hit, perform the database query
    const locations = await this.#performSearch({ q, latitude, longitude });

    // Cache the new results before returning
    this.#cacheResults(cacheKey, JSON.stringify(locations));

    return locations;
  }

  async #performSearch({
    q,
    latitude,
    longitude,
  }: TLocation): Promise<Array<TLocationDataResponse>> {
    const locationRepository = AppDataSource.manager.getRepository(Location);

    const result = await locationRepository
      .createQueryBuilder("location")
      .addSelect(
        `
        ST_Distance(
          ST_SetSRID(ST_MakePoint(location.longitude, location.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        )`,
        "distance",
      )
      .where("location.county ILIKE :q", { q: `%${q}%` })
      .orWhere("location.city ILIKE :q", { q: `%${q}%` })
      .orWhere("location.country ILIKE :q", { q: `%${q}%` })
      .setParameter("latitude", latitude)
      .setParameter("longitude", longitude)
      .orderBy("distance", "ASC")
      .take(12)
      .getRawAndEntities();

    const { entities: locations, raw } = result;

    return locations
      .map((location: any, index: any) => {
        const distanceKm = raw[index].distance / 1000; // Convert meters to kilometers for scoring
        const {
          city,
          county: stateOrProvince,
          country,
          latitude,
          longitude,
        } = location;
        const name = formatLocation(city, stateOrProvince, country);
        return {
          name,
          latitude,
          longitude,
          score: calculateScore(distanceKm),
        }; // Keep two decimals for score
      })
      .filter((location: any) => location.score > 0) // Filter out locations with very low scores
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score); // Sort from the highest score
  }

  async #getCachedResults(key: string): Promise<any> {
    try {
      const data = await client.get(key);
      return data;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async #cacheResults(key: string, data: any) {
    await client.set(key, data, {
      EX: 3600, // Cache expiration in seconds - 1 hour
    });
  }
}

export default GeoSearchService;
