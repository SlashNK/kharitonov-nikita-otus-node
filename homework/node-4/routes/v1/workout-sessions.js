const express = require('express')
const { generateId, paginateArray } = require('../../shared/utils')

const workoutSessionsApiRouter = express.Router()
const workoutSessions = []

workoutSessionsApiRouter.use(express.json())

workoutSessionsApiRouter.get('/', (req, res) => {
  const { page, limit } = req.query
  res.json(paginateArray(workoutSessions, limit, page))
})

workoutSessionsApiRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const session = workoutSessions.find((session) => session.id === id)
  if (!session) {
    return res.status(404).json({ error: 'Workout session not found' })
  }
  res.json(session)
})

workoutSessionsApiRouter.post('/', (req, res) => {
  const { user_id, workout_template_id, exercises, started_at, ended_at } =
    req.body
  if (
    !user_id ||
    !workout_template_id ||
    !exercises ||
    !started_at ||
    !ended_at
  ) {
    return res.status(400).json({ error: 'Validation failed' })
  }
  const newSession = {
    id: generateId(),
    user_id,
    workout_template_id,
    exercises,
    started_at,
    ended_at
  }
  workoutSessions.push(newSession)
  res.status(201).json(newSession)
})

workoutSessionsApiRouter.put('/:id', (req, res) => {
  const { id } = req.params
  const { user_id, workout_template_id, exercises, started_at, ended_at } =
    req.body
  const session = workoutSessions.find((session) => session.id === id)
  if (!session) {
    return res.status(404).json({ error: 'Workout session not found' })
  }
  session.user_id = user_id
  session.workout_template_id = workout_template_id
  session.exercises = exercises
  session.started_at = started_at
  session.ended_at = ended_at
  res.json(session)
})

workoutSessionsApiRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = workoutSessions.findIndex((session) => session.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Workout session not found' })
  }
  workoutSessions.splice(index, 1)
  res.status(204).send()
})

module.exports = {
  workoutSessionsApiRouter
}
