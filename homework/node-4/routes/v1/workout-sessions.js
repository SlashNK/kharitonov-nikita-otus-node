const express = require('express')
const WorkoutSession = require('../../models/workout-session.model')
const { paginateArray } = require('../../shared/utils')
const workoutSessionsApiRouter = express.Router()
workoutSessionsApiRouter.use(express.json())

workoutSessionsApiRouter.get('/', async (req, res) => {
  const { page, limit } = req.query
  try {
    const workoutSessions = await WorkoutSession.find()
    res.json(paginateArray(workoutSessions, limit, page))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

workoutSessionsApiRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const session = await WorkoutSession.findById(id)
    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' })
    }
    res.json(session)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

workoutSessionsApiRouter.post('/', async (req, res) => {
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

  try {
    const newSession = new WorkoutSession({
      user_id,
      workout_template_id,
      exercises,
      started_at,
      ended_at
    })

    await newSession.save()
    res.status(201).json(newSession)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

workoutSessionsApiRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { user_id, workout_template_id, exercises, started_at, ended_at } =
    req.body

  try {
    const session = await WorkoutSession.findById(id)
    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' })
    }

    session.user_id = user_id
    session.workout_template_id = workout_template_id
    session.exercises = exercises
    session.started_at = started_at
    session.ended_at = ended_at

    await session.save()
    res.json(session)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

workoutSessionsApiRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const session = await WorkoutSession.findById(id)
    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' })
    }
    await WorkoutSession.deleteOne({ _id: session._id })
    res.status(204).send()
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = {
  workoutSessionsApiRouter
}
