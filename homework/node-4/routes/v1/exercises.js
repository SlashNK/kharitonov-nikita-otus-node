const express = require('express')
const { generateId, paginateArray } = require('../../shared/utils')

const exercisesApiRouter = express.Router()
const exercises = []
exercisesApiRouter.use(express.json())

exercisesApiRouter.get('/', (req, res) => {
  const { page, limit } = req.query
  res.json(paginateArray(exercises, limit, page))
})

exercisesApiRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const exercise = exercises.find((exercise) => exercise.id === id)
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' })
  }
  res.json(exercise)
})

exercisesApiRouter.post('/', (req, res) => {
  const { name, description, type } = req.body
  if (!name || !description || !type) {
    return res.status(400).json({ error: 'Validation failed' })
  }
  const newExercise = {
    id: generateId(),
    name,
    description,
    type,
    created_at: new Date(),
    updated_at: new Date()
  }
  exercises.push(newExercise)
  res.status(201).json(newExercise)
})

exercisesApiRouter.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, description, type } = req.body
  const exercise = exercises.find((exercise) => exercise.id === id)
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' })
  }
  exercise.name = name
  exercise.description = description
  exercise.type = type
  exercise.updated_at = new Date()
  res.json(exercise)
})

exercisesApiRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = exercises.findIndex((exercise) => exercise.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Exercise not found' })
  }
  exercises.splice(index, 1)
  res.status(204).send()
})

module.exports = {
  exercisesApiRouter
}
