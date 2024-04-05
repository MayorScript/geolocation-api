import { ICountry, IState, Country, State } from "country-state-city";
import { client } from "./redis";
import logger from "./logger";

export function calculateScore(distanceKm: number): number {
  let score;
  if (distanceKm <= 400) {
    score = 0.9 + ((400 - distanceKm) / 400) * 0.1; // Scores between 0.9 and 1.0
  } else if (distanceKm > 400 && distanceKm <= 1000) {
    score = 0.5 + ((1000 - distanceKm) / 600) * 0.39; // Scores between 0.5 and 0.89
  } else if (distanceKm > 1000 && distanceKm <= 1600) {
    score = 0.1 + ((1600 - distanceKm) / 600) * 0.39; // Scores between 0.3 and 0.49
  } else {
    score = 0; // Filter scores with 0
  }
  return parseFloat(score.toFixed(1)); 
}

export async function clearCacheByVersion(versionPrefix: string) {
  try {
    // Fetch all keys that match the version prefix
    const keys = await client.keys(`${versionPrefix}:*`);
    if (keys.length === 0) {
      logger.info(`No cache keys to clear for version: ${versionPrefix}`);
      return;
    }

    // Delete each key found
    const deletePromises = keys.map((key) => client.del(key));
    await Promise.all(deletePromises);

    logger.info(
      `Cleared ${keys.length} cache keys for version: ${versionPrefix}`,
    );
  } catch (error) {
    logger.error(`Error clearing cache for version ${versionPrefix}:`, error);
    throw error; 
  }
}

export function formatLocation(
  city: string,
  stateName: string,
  countryName: string,
): string {
  let stateAbbrev = stateName;
  let countryAbbrev = countryName;

  // Get country ISO Code as abbreviation
  const country: ICountry | undefined = Country.getAllCountries().find(
    (c) => c.name === countryName,
  );
  if (country) {
    countryAbbrev = country.isoCode;
  }

  // Get state ISO Code as abbreviation
  if (country) {
    const state: IState | undefined = State.getStatesOfCountry(
      country.isoCode,
    ).find((s) => s.name === stateName);
    if (state) {
      stateAbbrev = state.isoCode;
    }
  }

  return `${city}, ${stateAbbrev}, ${countryAbbrev}`;
}

export function isValidCoordinate(
  value: number,
  type: "latitude" | "longitude",
): boolean {
  if (type === "latitude") return value >= -90 && value <= 90;
  if (type === "longitude") return value >= -180 && value <= 180;
  return false;
}
