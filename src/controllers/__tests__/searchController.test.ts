import request from "supertest";
import app from "../../app";

describe("GET /search", () => {
  it("should fetch search data successfully", async () => {
    const query = {
      q: "London",
      latitude: 53.436,
      longitude: -79.4163,
    };

    const response = await request(app)
      .get("/search")
      .query(query)
      .expect("Content-Type", /json/)
      .expect(200);

    // Assert on the response
    expect(response.body).toHaveProperty("suggestions");
  });

  it("should handle errors gracefully", async () => {
    const query = {
      q: "",
      latitude: "invalid",
      longitude: "invalid",
    };

    const response = await request(app)
      .get("/search")
      .query(query)
      .expect("Content-Type", /json/)
      .expect(400);

    // Assert on the error response
    expect(response.body).toHaveProperty("message");
  });
});
