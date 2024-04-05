// Mock the external dependencies
jest.mock("./src/database/datasource", () => {
  jest.requireActual("typeorm");

  return {
    __esModule: true, 
    default: {
      initialize: jest.fn().mockResolvedValue(undefined),
      manager: {
        getRepository: jest.fn().mockReturnValue({
          createQueryBuilder: jest.fn(() => ({
            addSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orWhere: jest.fn().mockReturnThis(),
            setParameter: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getRawAndEntities: jest.fn().mockResolvedValue({
              entities: [
                {
                  location_id: "7d1e8b76-197a-4464-a34d-5628101bf243",
                  location_street: "568 Aracely Row",
                  location_city: "Grand Rapids",
                  location_zip_code: "87332",
                  location_county: "Greater London",
                  location_country: "Anguilla",
                  location_latitude: 33.62,
                  location_longitude: -69.956,
                  location_time_zone: "Asia/Shanghai",
                  location_created_at: "2024-04-05T05:15:13.546Z",
                  location_updated_at: "2024-04-05T05:15:13.546Z",
                  distance: 2325854.51323252,
                },
              ], 
              raw: [
                {
                  id: "7d1e8b76-197a-4464-a34d-5628101bf243",
                  street: "568 Aracely Row",
                  city: "Grand Rapids",
                  zip_code: "87332",
                  county: "Greater London",
                  country: "Anguilla",
                  latitude: 33.62,
                  longitude: -69.956,
                  time_zone: "Asia/Shanghai",
                  created_at: "2024-04-05T05:15:13.546Z",
                  updated_at: "2024-04-05T05:15:13.546Z",
                },
              ], 
            }),
          })),
        }),
      },
    },
  };
});

jest.mock("./src/lib/redis", () => ({
  client: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn(),
  },
}));
