const express = require('express')
const { paginateArray } = require('../../shared/utils')
const WorkoutBlock = require('../../models/workout-block.model')
const workoutBlocksApiRouter = express.Router()
workoutBlocksApiRouter.use(express.json())

workoutBlocksApiRouter.get('/', async (req, res) => {
  const { page, limit } = req.query
  const workoutBlocks = await WorkoutBlock.find()
  res.json(paginateArray(workoutBlocks, limit, page))
})

workoutBlocksApiRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const workoutBlock = await WorkoutBlock.findById(id)
    if (!workoutBlock) {
      return res.status(404).json({ error: 'Workout block not found' })
    }
    res.json(workoutBlock)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

workoutBlocksApiRouter.post('/', async (req, res) => {
  const { name, exercises } = req.body
  try {
    if (!name || !exercises) {
      return res.status(400).json({ error: 'Validation failed' })
    }
    const newWorkoutBlock = new WorkoutBlock({ name, exercises })
    await newWorkoutBlock.save()
    res.status(201).json(newWorkoutBlock)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

workoutBlocksApiRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, exercises } = req.body
  try {
    const workoutBlock = await WorkoutBlock.findById(id)
    if (!workoutBlock) {
      return res.status(404).json({ error: 'Workout block not found' })
    }
    workoutBlock.name = name
    workoutBlock.exercises = exercises
    await workoutBlock.save()
    res.json(workoutBlock)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

workoutBlocksApiRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const workoutBlock = await WorkoutBlock.findById(id)
    if (!workoutBlock) {
      return res.status(404).json({ error: 'Workout block not found' })
    }
    await WorkoutBlock.deleteOne({ _id: workoutBlock._id })
    res.status(204).send()
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
})

module.exports = {
  workoutBlocksApiRouter
}
