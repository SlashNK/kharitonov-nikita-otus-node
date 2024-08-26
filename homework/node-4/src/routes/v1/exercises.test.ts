import request from "supertest";
import express from "express";
import { exercisesApiRouter } from "./exercises";
import { DEFAULT_QUERY_LIMIT } from "../../shared/constants";
import { connectToMongoDB, disconnectFromMongoDB } from "../../shared/mongoose";

const app = express();
app.use(express.json());
app.use("/api/exercises", exercisesApiRouter);

describe("Exercise API CRUD operations", () => {
  let exerciseId: string;
  const exercises: string[] = [];

  beforeAll(async () => {
    require("dotenv").config();
    await connectToMongoDB(
      process.env.MONGO_DB_ADDRESS || "mongodb://127.0.0.1:27017/workout-logger"
    );
    for (let i = 1; i <= 15; i++) {
      const response = await request(app)
        .post("/api/exercises")
        .send({
          name: `Exercise ${i}`,
          description: `Description for Exercise ${i}`,
          type: "strength",
        });
      exercises.push(response.body._id);
    }
  });

  afterAll(async () => {
    for (const exercise of exercises) {
      await request(app).delete(`/api/exercises/${exercise}`);
    }
    await disconnectFromMongoDB();
    console.log("MongoDB connection closed.");
  });

  it("should create a new exercise", async () => {
    const response = await request(app).post("/api/exercises").send({
      name: "Push-Up",
      description: "An upper body exercise",
      type: "strength",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe("Push-Up");
    expect(response.body.description).toBe("An upper body exercise");
    expect(response.body.type).toBe("strength");
    exerciseId = response.body._id;
  });

  it("should handle validation with 400 status", async () => {
    const response = await request(app).post("/api/exercises").send({
      name: "Invalid Exercise",
      description: "An invalid exercise for testing",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should get all exercises with default limit", async () => {
    const response = await request(app).get("/api/exercises");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(DEFAULT_QUERY_LIMIT);
  });

  it("should get an exercise by ID", async () => {
    const response = await request(app).get(`/api/exercises/${exerciseId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", exerciseId);
    expect(response.body.name).toBe("Push-Up");
    expect(response.body.description).toBe("An upper body exercise");
    expect(response.body.type).toBe("strength");
  });

  it("should update an exercise by ID", async () => {
    const response = await request(app)
      .put(`/api/exercises/${exerciseId}`)
      .send({
        name: "Updated Push-Up",
        description: "An updated upper body exercise",
        type: "strength",
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", exerciseId);
    expect(response.body.name).toBe("Updated Push-Up");
    expect(response.body.description).toBe("An updated upper body exercise");
    expect(response.body.type).toBe("strength");
  });

  it("should delete an exercise by ID", async () => {
    const response = await request(app).delete(`/api/exercises/${exerciseId}`);
    expect(response.status).toBe(204);
  });

  it("should return 404 when trying to get a deleted exercise", async () => {
    const response = await request(app).get(`/api/exercises/${exerciseId}`);
    expect(response.status).toBe(404);
  });

  it("should return 404 when trying to update a deleted exercise", async () => {
    const response = await request(app).put(`/api/exercises/${exerciseId}`);
    expect(response.status).toBe(404);
  });

  it("should return 404 when trying to delete a deleted exercise", async () => {
    const response = await request(app).delete(`/api/exercises/${exerciseId}`);
    expect(response.status).toBe(404);
  });
});
