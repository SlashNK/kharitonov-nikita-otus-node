const request = require("supertest");
const express = require("express");
const { workoutTemplatesApiRouter } = require("./workout-templates.js"); // Assuming you have a workout-templates.js file with apiRouter
const { workoutBlocksApiRouter } = require("./workout-blocks.js"); // Assuming you have workout-blocks routes for creating workout blocks
const app = express();
app.use(express.json());
app.use("/api/workout-templates", workoutTemplatesApiRouter);
app.use("/api/workout-blocks", workoutBlocksApiRouter);

describe("Workout Template API CRUD operations", () => {
  let workoutTemplateId;
  let workoutBlockId;

  beforeAll(async () => {
    // Creating a workout block to use in the workout template tests
    const workoutBlock = await request(app)
      .post("/api/workout-blocks")
      .send({ name: "Upper Body Block", exercises: [] });
    workoutBlockId = workoutBlock.body.id;
  });

  it("should create a new workout template", async () => {
    const response = await request(app)
      .post("/api/workout-templates")
      .send({
        name: "Full Body Routine",
        workout_blocks: [workoutBlockId],
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Full Body Routine");
    expect(response.body.workout_blocks).toContain(workoutBlockId);
    workoutTemplateId = response.body.id;
  });
  it("should handle validation with 400 status", async () => {
    const response = await request(app).post("/api/workout-templates").send({
      name: "Invalid Workout Block",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should get all workout templates", async () => {
    const response = await request(app).get("/api/workout-templates");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a workout template by ID", async () => {
    const response = await request(app).get(
      `/api/workout-templates/${workoutTemplateId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", workoutTemplateId);
    expect(response.body.name).toBe("Full Body Routine");
    expect(response.body.workout_blocks).toContain(workoutBlockId);
  });

  it("should update a workout template by ID", async () => {
    const response = await request(app)
      .put(`/api/workout-templates/${workoutTemplateId}`)
      .send({
        name: "Updated Full Body Routine",
        workout_blocks: [workoutBlockId],
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", workoutTemplateId);
    expect(response.body.name).toBe("Updated Full Body Routine");
    expect(response.body.workout_blocks).toContain(workoutBlockId);
  });


  it("should delete a workout template by ID", async () => {
    const response = await request(app).delete(
      `/api/workout-templates/${workoutTemplateId}`
    );
    expect(response.status).toBe(204);
  });
  it("should return 404 when trying to get a deleted workout template", async () => {
    const response = await request(app).get(
      `/api/workout-templates/${workoutTemplateId}`
    );

    expect(response.status).toBe(404);
  });
  it("should return 404 when trying to update a deleted workout template", async () => {
    const response = await request(app).put(
      `/api/workout-templates/${workoutTemplateId}`
    );

    expect(response.status).toBe(404);
  });
  it("should return 404 when trying to delete a deleted workout template", async () => {
    const response = await request(app).delete(
      `/api/workout-templates/${workoutTemplateId}`
    );

    expect(response.status).toBe(404);
  });
});
