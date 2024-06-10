const request = require('supertest')
const express = require('express')
const { apiRouter } = require('./users.js')

const app = express()
app.use(express.json())
app.use('/api/users', apiRouter)

describe('User API CRUD operations', () => {
  let userId

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'New User', email: 'user@example.com' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.username).toBe('New User')
    expect(response.body.email).toBe('user@example.com')

    userId = response.body.id
  })

  it('should get all users', async () => {
    const response = await request(app).get('/api/users')

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('should get a user by ID', async () => {
    const response = await request(app).get(`/api/users/${userId}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', userId)
    expect(response.body.name).toBe('New User')
    expect(response.body.email).toBe('user@example.com')
  })

  it('should update a user by ID', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'Updated User', email: 'user-updated@example.com' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', userId)
    expect(response.body.name).toBe('Updated User')
    expect(response.body.email).toBe('user-updated@example.com')
  })

  it('should delete a user by ID', async () => {
    const response = await request(app).delete(`/api/users/${userId}`)

    expect(response.status).toBe(204)
  })

  it('should return 404 when trying to get a deleted user', async () => {
    const response = await request(app).get(`/api/users/${userId}`)

    expect(response.status).toBe(404)
  })
})
