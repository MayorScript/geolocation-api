import GeoSearchService from "../search.service";

// Tests for GeoSearchService
describe("GeoSearchService", () => {
  let geoSearchService: GeoSearchService;

  beforeEach(() => {
    geoSearchService = new GeoSearchService();
  });
  it("should return search data", async () => {
    // Execute the service method
    const result = await geoSearchService.searchByGeo({
      q: "London",
      latitude: 53.436,
      longitude: -79.4163,
    });

    // Assert on the returned data
    expect(result).toBeDefined();
  });

  it("should throw an error for missing or invalid parameters", async () => {
    await expect(
      geoSearchService.searchByGeo({ q: "", latitude: NaN, longitude: NaN }),
    ).rejects.toThrow(
      "Invalid search parameters. Ensure query, latitude, and longitude are correct.",
    );
  });

  it("should return an empty array for no matching results", async () => {
    await expect(
      geoSearchService.searchByGeo({
        q: "NonexistentLocation",
        longitude: 1,
        latitude: 1,
      }),
    ).resolves.toEqual([]);
  });

  it("should maintain acceptable response times under load", async () => {
    const startTime = process.hrtime();
    await Promise.all(
      Array.from({ length: 100 }).map(() =>
        geoSearchService.searchByGeo({
          q: "HighLoadQuery",
          longitude: 53.436,
          latitude: -79.4163,
        }),
      ),
    );
    const [seconds, nanoseconds] = process.hrtime(startTime);

    const totalTimeInMilliseconds = seconds * 1000 + nanoseconds / 1e6;
    expect(totalTimeInMilliseconds).toBeLessThan(1000); // Expect all queries to complete in under 1 second
  });
});
