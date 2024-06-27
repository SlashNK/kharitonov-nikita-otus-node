const request = require('supertest')
const express = require('express')
const { workoutTemplatesApiRouter } = require('./workout-templates.js')
const { workoutBlocksApiRouter } = require('./workout-blocks.js')
const {
  connectToMongoDB,
  disconnectFromMongoDB
} = require('../../shared/mongoose')

const app = express()
app.use(express.json())
app.use('/api/workout-templates', workoutTemplatesApiRouter)
app.use('/api/workout-blocks', workoutBlocksApiRouter)

describe('Workout Template API CRUD operations', () => {
  let workoutTemplateId
  let workoutBlockId1
  let workoutBlockId2

  beforeAll(async () => {
    require('dotenv').config()
    await connectToMongoDB(
      process.env.MONGO_DB_ADDRESS || 'mongodb://127.0.0.1:27017/workout-logger'
    )

    const workoutBlock1 = await request(app).post('/api/workout-blocks').send({
      name: 'Upper Body Workout',
      exercises: []
    })
    workoutBlockId1 = workoutBlock1.body._id

    const workoutBlock2 = await request(app).post('/api/workout-blocks').send({
      name: 'Lower Body Workout',
      exercises: []
    })
    workoutBlockId2 = workoutBlock2.body._id
  })

  afterAll(async () => {
    await request(app).delete(`/api/workout-blocks/${workoutBlockId1}`)
    await request(app).delete(`/api/workout-blocks/${workoutBlockId2}`)
    await disconnectFromMongoDB()
    console.log('MongoDB connection closed.')
  })

  it('should create a new workout template', async () => {
    const response = await request(app)
      .post('/api/workout-templates')
      .send({
        name: 'Full Body Routine',
        workout_blocks: [workoutBlockId1, workoutBlockId2]
      })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe('Full Body Routine')
    expect(response.body.workout_blocks).toContain(workoutBlockId1)
    expect(response.body.workout_blocks).toContain(workoutBlockId2)
    workoutTemplateId = response.body._id
  })
  it('should handle validation with 400 status', async () => {
    const response = await request(app).post('/api/workout-templates').send({
      name: 'Invalid Workout Template'
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  it('should get all workout templates', async () => {
    const response = await request(app).get('/api/workout-templates')
    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('should get a workout template by ID', async () => {
    const response = await request(app).get(
      `/api/workout-templates/${workoutTemplateId}`
    )
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id', workoutTemplateId)
    expect(response.body.name).toBe('Full Body Routine')
    expect(response.body.workout_blocks).toContain(workoutBlockId1)
    expect(response.body.workout_blocks).toContain(workoutBlockId2)
  })

  it('should update a workout template by ID', async () => {
    const response = await request(app)
      .put(`/api/workout-templates/${workoutTemplateId}`)
      .send({
        name: 'Updated Full Body Routine',
        workout_blocks: [workoutBlockId1]
      })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id', workoutTemplateId)
    expect(response.body.name).toBe('Updated Full Body Routine')
    expect(response.body.workout_blocks).toContain(workoutBlockId1)
    expect(response.body.workout_blocks).not.toContain(workoutBlockId2)
  })

  it('should delete a workout template by ID', async () => {
    const response = await request(app).delete(
      `/api/workout-templates/${workoutTemplateId}`
    )
    expect(response.status).toBe(204)
  })

  it('should return 404 when trying to get a deleted workout template', async () => {
    const response = await request(app).get(
      `/api/workout-templates/${workoutTemplateId}`
    )
    expect(response.status).toBe(404)
  })

  it('should return 404 when trying to update a deleted workout template', async () => {
    const response = await request(app)
      .put(`/api/workout-templates/${workoutTemplateId}`)
      .send({
        name: 'Updated Weekly Workout Plan',
        workout_blocks: [workoutBlockId1]
      })
    expect(response.status).toBe(404)
  })

  it('should return 404 when trying to delete a deleted workout template', async () => {
    const response = await request(app).delete(
      `/api/workout-templates/${workoutTemplateId}`
    )
    expect(response.status).toBe(404)
  })
})
