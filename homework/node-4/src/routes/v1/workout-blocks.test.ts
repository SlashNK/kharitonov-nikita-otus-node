import request from 'supertest';
import express, { Express } from 'express';
import { workoutBlocksApiRouter } from './workout-blocks';
import { exercisesApiRouter } from './exercises';
import { connectToMongoDB, disconnectFromMongoDB } from '../../shared/mongoose';

const app: Express = express();
app.use(express.json());
app.use('/api/workout-blocks', workoutBlocksApiRouter);
app.use('/api/exercises', exercisesApiRouter);

describe('Workout Block API CRUD operations', () => {
  let workoutBlockId: string;
  let exerciseId1: string;
  let exerciseId2: string;

  beforeAll(async () => {
    require('dotenv').config();
    await connectToMongoDB(process.env.MONGO_DB_ADDRESS || 'mongodb://127.0.0.1:27017/workout-logger');

    const exercise1 = await request(app).post('/api/exercises').send({
      name: 'Squat',
      description: 'A lower body exercise',
      type: 'strength',
    });
    exerciseId1 = exercise1.body._id;

    const exercise2 = await request(app).post('/api/exercises').send({
      name: 'Bench Press',
      description: 'An upper body exercise',
      type: 'strength',
    });
    exerciseId2 = exercise2.body._id;
  });

  afterAll(async () => {
    await request(app).delete(`/api/exercises/${exerciseId1}`);
    await request(app).delete(`/api/exercises/${exerciseId2}`);
    await disconnectFromMongoDB();
    console.log('MongoDB connection closed.');
  });

  it('should create a new workout block', async () => {
    const response = await request(app)
      .post('/api/workout-blocks')
      .send({
        name: 'Full Body Workout',
        exercises: [exerciseId1, exerciseId2],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Full Body Workout');
    expect(response.body.exercises).toContain(exerciseId1);
    expect(response.body.exercises).toContain(exerciseId2);
    workoutBlockId = response.body._id;
  });

  it('should handle validation with 400 status', async () => {
    const response = await request(app).post('/api/workout-blocks').send({
      name: 'Invalid Workout Block',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should get all workout blocks', async () => {
    const response = await request(app).get('/api/workout-blocks');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a workout block by ID', async () => {
    const response = await request(app).get(`/api/workout-blocks/${workoutBlockId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', workoutBlockId);
    expect(response.body.name).toBe('Full Body Workout');
    expect(response.body.exercises).toContain(exerciseId1);
    expect(response.body.exercises).toContain(exerciseId2);
  });

  it('should update a workout block by ID', async () => {
    const response = await request(app)
      .put(`/api/workout-blocks/${workoutBlockId}`)
      .send({
        name: 'Updated Full Body Workout',
        exercises: [exerciseId1],
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', workoutBlockId);
    expect(response.body.name).toBe('Updated Full Body Workout');
    expect(response.body.exercises).toContain(exerciseId1);
    expect(response.body.exercises).not.toContain(exerciseId2);
  });

  it('should delete a workout block by ID', async () => {
    const response = await request(app).delete(`/api/workout-blocks/${workoutBlockId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 when trying to get a deleted workout block', async () => {
    const response = await request(app).get(`/api/workout-blocks/${workoutBlockId}`);
    expect(response.status).toBe(404);
  });

  it('should return 404 when trying to update a deleted workout block', async () => {
    const response = await request(app).put(`/api/workout-blocks/${workoutBlockId}`);
    expect(response.status).toBe(404);
  });

  it('should return 404 when trying to delete a deleted workout block', async () => {
    const response = await request(app).delete(`/api/workout-blocks/${workoutBlockId}`);
    expect(response.status).toBe(404);
  });
});
