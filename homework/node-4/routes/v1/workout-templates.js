const express = require('express')
const { paginateArray } = require('../../shared/utils')
const WorkoutTemplate = require('../../models/workout-template.model')
const workoutTemplatesApiRouter = express.Router()
workoutTemplatesApiRouter.use(express.json())

workoutTemplatesApiRouter.get('/', async (req, res) => {
  const { page, limit } = req.query
  const workoutTemplates = await WorkoutTemplate.find()
  res.json(paginateArray(workoutTemplates, limit, page))
})

workoutTemplatesApiRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const workoutTemplate = await WorkoutTemplate.findById(id)
    if (!workoutTemplate) {
      return res.status(404).json({ error: 'Workout template not found' })
    }
    res.json(workoutTemplate)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

workoutTemplatesApiRouter.post('/', async (req, res) => {
  const { name, workout_blocks } = req.body
  try {
    if (!name || !workout_blocks) {
      return res.status(400).json({ error: 'Validation failed' })
    }
    const newWorkoutTemplate = new WorkoutTemplate({ name, workout_blocks })
    await newWorkoutTemplate.save()
    res.status(201).json(newWorkoutTemplate)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

workoutTemplatesApiRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, workout_blocks } = req.body
  try {
    const workoutTemplate = await WorkoutTemplate.findById(id)
    if (!workoutTemplate) {
      return res.status(404).json({ error: 'Workout template not found' })
    }
    workoutTemplate.name = name
    workoutTemplate.workout_blocks = workout_blocks
    await workoutTemplate.save()
    res.json(workoutTemplate)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

workoutTemplatesApiRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const workoutTemplate = await WorkoutTemplate.findById(id)
    if (!workoutTemplate) {
      return res.status(404).json({ error: 'Workout template not found' })
    }
    await WorkoutTemplate.deleteOne({ _id: workoutTemplate._id })
    res.status(204).send()
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
})

module.exports = {
  workoutTemplatesApiRouter
}
