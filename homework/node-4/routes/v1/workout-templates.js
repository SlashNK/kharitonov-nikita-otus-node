const express = require('express')
const { generateId, paginateArray } = require('../../shared/utils')

const workoutTemplatesApiRouter = express.Router()
const workoutTemplates = []

workoutTemplatesApiRouter.use(express.json())

workoutTemplatesApiRouter.get('/', (req, res) => {
  const { page, limit } = req.query
  res.json(paginateArray(workoutTemplates, limit, page))
})

workoutTemplatesApiRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const workoutTemplate = workoutTemplates.find(
    (template) => template.id === id
  )
  if (!workoutTemplate) {
    return res.status(404).json({ error: 'Workout template not found' })
  }
  res.json(workoutTemplate)
})

workoutTemplatesApiRouter.post('/', (req, res) => {
  const { name, workout_blocks } = req.body
  if (!name || !Array.isArray(workout_blocks)) {
    return res.status(400).json({ error: 'Validation failed' })
  }
  const newWorkoutTemplate = { id: generateId(), name, workout_blocks }
  workoutTemplates.push(newWorkoutTemplate)
  res.status(201).json(newWorkoutTemplate)
})

workoutTemplatesApiRouter.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, workout_blocks } = req.body
  const workoutTemplate = workoutTemplates.find(
    (template) => template.id === id
  )
  if (!workoutTemplate) {
    return res.status(404).json({ error: 'Workout template not found' })
  }
  workoutTemplate.name = name
  workoutTemplate.workout_blocks = workout_blocks
  res.json(workoutTemplate)
})

workoutTemplatesApiRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = workoutTemplates.findIndex((template) => template.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Workout template not found' })
  }
  workoutTemplates.splice(index, 1)
  res.status(204).send()
})

module.exports = {
  workoutTemplatesApiRouter
}
