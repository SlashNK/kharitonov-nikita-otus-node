const request = require('supertest')
const express = require('express')
const { workoutSessionsApiRouter } = require('./workout-sessions.js')
const { usersApiRouter } = require('./users.js')
const { workoutTemplatesApiRouter } = require('./workout-templates.js')
const { exercisesApiRouter } = require('./exercises.js')
const { workoutBlocksApiRouter } = require('./workout-blocks.js')
const {
  connectToMongoDB,
  disconnectFromMongoDB
} = require('../../shared/mongoose')
const app = express()
app.use(express.json())
app.use('/api/workout-sessions', workoutSessionsApiRouter)
app.use('/api/users', usersApiRouter)
app.use('/api/workout-templates', workoutTemplatesApiRouter)
app.use('/api/exercises', exercisesApiRouter)
app.use('/api/workout-blocks', workoutBlocksApiRouter)

describe('Workout Session API CRUD operations', () => {
  let workoutSessionId
  let userId
  let workoutTemplateId
  let workoutBlockId
  let exerciseId

  beforeAll(async () => {
    require('dotenv').config()
    await connectToMongoDB(
      process.env.MONGO_DB_ADDRESS || 'mongodb://127.0.0.1:27017/workout-logger'
    )
    const user = await request(app)
      .post('/api/users')
      .send({ username: 'testuser', email: 'test@example.com' })
    userId = user.body._id
    const exercise = await request(app).post('/api/exercises').send({
      name: 'Squat',
      description: 'A lower body exercise',
      type: 'strength'
    })
    exerciseId = exercise.body._id
    const workoutBlock = await request(app)
      .post('/api/workout-blocks')
      .send({ name: 'Lower Body Block', exercises: [exerciseId] })
    workoutBlockId = workoutBlock.body._id
    const workoutTemplate = await request(app)
      .post('/api/workout-templates')
      .send({
        name: 'Leg Day Routine TEMP',
        workout_blocks: [workoutBlockId]
      })
    workoutTemplateId = workoutTemplate.body._id
  })
  afterAll(async () => {
    await request(app).delete(`/api/workout-blocks/${workoutBlockId}`)
    await request(app).delete(`/api/workout-templates/${workoutTemplateId}`)
    await request(app).delete(`/api/exercises/${exerciseId}`)
    await disconnectFromMongoDB()
    console.log('MongoDB connection closed.')
  })

  it('should create a new workout session', async () => {
    const response = await request(app)
      .post('/api/workout-sessions')
      .send({
        user_id: userId,
        workout_template_id: workoutTemplateId,
        exercises: [
          {
            exercise_id: exerciseId,
            sets: [
              { weight: 100, reps: 10 },
              { weight: 105, reps: 8 }
            ],
            notes: 'Felt strong'
          }
        ],
        started_at: new Date(),
        ended_at: new Date()
      })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.user_id).toBe(userId)
    expect(response.body.workout_template_id).toBe(workoutTemplateId)
    expect(response.body.exercises.length).toBe(1)
    workoutSessionId = response.body._id
  })
  it('should handle validation with 400 status', async () => {
    const response = await request(app).post('/api/workout-sessions').send({
      notes: 'Invalid Session'
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  it('should get all workout sessions', async () => {
    const response = await request(app).get('/api/workout-sessions')
    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('should get a workout session by ID', async () => {
    const response = await request(app).get(
      `/api/workout-sessions/${workoutSessionId}`
    )
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id', workoutSessionId)
    expect(response.body.user_id).toBe(userId)
    expect(response.body.workout_template_id).toBe(workoutTemplateId)
    expect(response.body.exercises.length).toBe(1)
  })

  it('should update a workout session by ID', async () => {
    const response = await request(app)
      .put(`/api/workout-sessions/${workoutSessionId}`)
      .send({
        user_id: userId,
        workout_template_id: workoutTemplateId,
        exercises: [
          {
            exercise_id: exerciseId,
            sets: [
              { weight: 110, reps: 6 },
              { weight: 115, reps: 5 }
            ],
            notes: 'Felt even stronger'
          }
        ],
        started_at: new Date(),
        ended_at: new Date()
      })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id', workoutSessionId)
    expect(response.body.exercises[0].sets[0].weight).toBe(110)
    expect(response.body.exercises[0].sets[1].reps).toBe(5)
  })

  it('should delete a workout session by ID', async () => {
    const response = await request(app).delete(
      `/api/workout-sessions/${workoutSessionId}`
    )
    expect(response.status).toBe(204)
  })
  it('should return 404 when trying to get a deleted workout session', async () => {
    const response = await request(app).get(
      `/api/workout-sessions/${workoutSessionId}`
    )

    expect(response.status).toBe(404)
  })
  it('should return 404 when trying to update a deleted workout session', async () => {
    const response = await request(app).put(
      `/api/workout-sessions/${workoutSessionId}`
    )

    expect(response.status).toBe(404)
  })
  it('should return 404 when trying to delete a deleted workout session', async () => {
    const response = await request(app).delete(
      `/api/workout-sessions/${workoutSessionId}`
    )

    expect(response.status).toBe(404)
  })
})
