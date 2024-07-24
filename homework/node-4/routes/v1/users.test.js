const request = require("supertest");
const express = require("express");
const { usersApiRouter } = require("./users.js");
const { DEFAULT_QUERY_LIMIT } = require("../../shared/constants");
const {
  connectToMongoDB,
  disconnectFromMongoDB,
} = require("../../shared/mongoose");

const app = express();
app.use(express.json());
app.use("/api/users", usersApiRouter);

describe("User API CRUD operations", () => {
  let userId;
  const users = [];

  beforeAll(async () => {
    require("dotenv").config();
    await connectToMongoDB(
      process.env.MONGO_DB_ADDRESS || "mongodb://127.0.0.1:27017/workout-logger"
    );
    for (let i = 1; i <= 15; i++) {
      const response = await request(app)
        .post("/api/users")
        .send({
          username: `User ${i}`,
          email: `user${i}@example.com`,
          password: "password123",
        });
      users.push(response.body._id);
    }
  });
  afterAll(async () => {
    for (const user of users) {
      await request(app).delete(`/api/users/${user}`);
    }
    await disconnectFromMongoDB();
    console.log("MongoDB connection closed.");
  });
  it("should create a new user", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        username: "New User",
        email: "user@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.username).toBe("New User");
    expect(response.body.email).toBe("user@example.com");
    userId = response.body._id;
  });
  it("should handle validation with 400 status", async () => {
    const response = await request(app).post("/api/users").send({
      name: "Invalid User",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("should get all exercises with default limit", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(DEFAULT_QUERY_LIMIT);
  });

  it("should get a user by ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", userId);
    expect(response.body.username).toBe("New User");
    expect(response.body.email).toBe("user@example.com");
  });

  it("should update a user by ID", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ username: "Updated User", email: "user-updated@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", userId);
    expect(response.body.username).toBe("Updated User");
    expect(response.body.email).toBe("user-updated@example.com");
  });

  it("should delete a user by ID", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);

    expect(response.status).toBe(204);
  });
  it("should return 404 when trying to get a deleted user", async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(404);
  });
  it("should return 404 when trying to update a deleted user", async () => {
    const response = await request(app).put(`/api/users/${userId}`);

    expect(response.status).toBe(404);
  });
  it("should return 404 when trying to delete a deleted user", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);

    expect(response.status).toBe(404);
  });
});
