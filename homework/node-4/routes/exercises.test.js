const request = require("supertest");
const express = require("express");
const { exercisesApiRouter } = require("./exercises.js");
const app = express();
app.use(express.json());
app.use("/api/exercises", exercisesApiRouter);

describe.skip("Exercise API CRUD operations", () => {
  let exerciseId;

  it("should create a new exercise", async () => {
    const response = await request(app).post("/api/exercises").send({
      name: "Push-Up",
      description: "An upper body exercise",
      type: "strength",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Push-Up");
    expect(response.body.description).toBe("An upper body exercise");
    expect(response.body.type).toBe("strength");
    exerciseId = response.body.id;
  });

  it("should get all exercises", async () => {
    const response = await request(app).get("/api/exercises");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get an exercise by ID", async () => {
    const response = await request(app).get(`/api/exercises/${exerciseId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", exerciseId);
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
    expect(response.body).toHaveProperty("id", exerciseId);
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
});
