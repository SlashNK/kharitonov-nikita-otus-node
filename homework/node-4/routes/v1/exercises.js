const express = require('express')
const { paginateArray } = require('../../shared/utils')
const Exercise = require('../../models/exercise.model')
const exercisesApiRouter = express.Router()
exercisesApiRouter.use(express.json())

exercisesApiRouter.get('/', async (req, res) => {
  const { page, limit } = req.query
  const exercises = await Exercise.find()
  res.json(paginateArray(exercises, limit, page))
})

exercisesApiRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const exercise = await Exercise.findById(id)
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }
    res.json(exercise)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

exercisesApiRouter.post('/', async (req, res) => {
  const { name, description, type } = req.body
  try {
    if (!name || !description || !type) {
      return res.status(400).json({ error: 'Validation failed' })
    }
    const newExercise = new Exercise({ name, description, type })
    await newExercise.save()
    res.status(201).json(newExercise)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

exercisesApiRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, type } = req.body
  try {
    const exercise = await Exercise.findById(id)
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }
    exercise.name = name
    exercise.description = description
    exercise.type = type
    await exercise.save()
    res.json(exercise)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

exercisesApiRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const exercise = await Exercise.findById(id)
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }
    await Exercise.deleteOne({ _id: exercise._id })
    res.status(204).send()
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
})

module.exports = {
  exercisesApiRouter
}
