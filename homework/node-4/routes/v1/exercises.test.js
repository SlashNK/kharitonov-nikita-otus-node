const request = require('supertest')
const express = require('express')
const { exercisesApiRouter } = require('./exercises.js')
const { DEFAULT_QUERY_LIMIT } = require('../../shared/constants')
const app = express()
app.use(express.json())
app.use('/api/exercises', exercisesApiRouter)

describe('Exercise API CRUD operations', () => {
  let exerciseId
  const exercises = []

  beforeAll(async () => {
    for (let i = 1; i <= 15; i++) {
      const response = await request(app)
        .post('/api/exercises')
        .send({
          name: `Exercise ${i}`,
          description: `Description for Exercise ${i}`,
          type: 'strength'
        })
      exercises.push(response.body.id)
    }
  })

  it('should create a new exercise', async () => {
    const response = await request(app).post('/api/exercises').send({
      name: 'Push-Up',
      description: 'An upper body exercise',
      type: 'strength'
    })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Push-Up')
    expect(response.body.description).toBe('An upper body exercise')
    expect(response.body.type).toBe('strength')
    exerciseId = response.body.id
  })
  it('should handle validation with 400 status', async () => {
    const response = await request(app).post('/api/exercises').send({
      name: 'Invalid Exercise',
      description: 'An invalid exercise for testing'
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })
  it('should get all exercises with default limit', async () => {
    const response = await request(app).get('/api/exercises')
    expect(response.status).toBe(200)
    expect(response.body.length).toBeLessThanOrEqual(DEFAULT_QUERY_LIMIT)
  })

  it('should return an empty array for a page that does not exist', async () => {
    const response = await request(app)
      .get('/api/exercises')
      .query({ page: 3, limit: 10 })
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(0)
  })

  it('should get an exercise by ID', async () => {
    const response = await request(app).get(`/api/exercises/${exerciseId}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', exerciseId)
    expect(response.body.name).toBe('Push-Up')
    expect(response.body.description).toBe('An upper body exercise')
    expect(response.body.type).toBe('strength')
  })
  it('should update an exercise by ID', async () => {
    const response = await request(app)
      .put(`/api/exercises/${exerciseId}`)
      .send({
        name: 'Updated Push-Up',
        description: 'An updated upper body exercise',
        type: 'strength'
      })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', exerciseId)
    expect(response.body.name).toBe('Updated Push-Up')
    expect(response.body.description).toBe('An updated upper body exercise')
    expect(response.body.type).toBe('strength')
  })
  it('should return 404 when trying to update a non-existent exercise', async () => {
    const nonExistentId = 'nonExistentId' // Assuming this ID does not exist
    const response = await request(app)
      .put(`/api/exercises/${nonExistentId}`)
      .send({
        name: 'Updated Push-Up',
        description: 'An updated upper body exercise',
        type: 'strength'
      })
    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Exercise not found')
  })

  it('should delete an exercise by ID', async () => {
    const response = await request(app).delete(`/api/exercises/${exerciseId}`)
    expect(response.status).toBe(204)
  })
  it('should return 404 when trying to delete a non-existent exercise', async () => {
    const nonExistentId = 'nonExistentId'
    const response = await request(app).delete(
      `/api/exercises/${nonExistentId}`
    )
    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Exercise not found')
  })
  it('should return 404 when trying to get a deleted exercise', async () => {
    const response = await request(app).get(`/api/exercises/${exerciseId}`)

    expect(response.status).toBe(404)
  })
  it('should return 404 when trying to update a deleted exercise', async () => {
    const response = await request(app).put(`/api/exercises/${exerciseId}`)

    expect(response.status).toBe(404)
  })
  it('should return 404 when trying to delete a deleted exercise', async () => {
    const response = await request(app).delete(`/api/exercises/${exerciseId}`)

    expect(response.status).toBe(404)
  })
})
