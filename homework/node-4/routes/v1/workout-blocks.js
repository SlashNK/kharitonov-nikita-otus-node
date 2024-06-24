const express = require('express')
const { generateId, paginateArray } = require('../../shared/utils')

const workoutBlocksApiRouter = express.Router()
const workoutBlocks = []
workoutBlocksApiRouter.use(express.json())

workoutBlocksApiRouter.get('/', (req, res) => {
  const { page, limit } = req.query
  res.json(paginateArray(workoutBlocks, limit, page))
})

workoutBlocksApiRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const workoutBlock = workoutBlocks.find((block) => block.id === id)
  if (!workoutBlock) {
    return res.status(404).json({ error: 'Workout block not found' })
  }
  res.json(workoutBlock)
})

workoutBlocksApiRouter.post('/', (req, res) => {
  const { name, exercises } = req.body
  if (!name || !exercises) {
    return res.status(400).json({ error: 'Validation failed' })
  }
  const newWorkoutBlock = { id: generateId(), name, exercises, created_at: new Date(), updated_at: new Date() }
  workoutBlocks.push(newWorkoutBlock)

  res.status(201).json(newWorkoutBlock)
})

workoutBlocksApiRouter.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, exercises } = req.body
  const workoutBlock = workoutBlocks.find((block) => block.id === id)
  if (!workoutBlock) {
    return res.status(404).json({ error: 'Workout block not found' })
  }
  workoutBlock.name = name
  workoutBlock.exercises = exercises
  workoutBlock.updated_at = new Date()
  res.json(workoutBlock)
})

workoutBlocksApiRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = workoutBlocks.findIndex((block) => block.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Workout block not found' })
  }
  workoutBlocks.splice(index, 1)
  res.status(204).send()
})

module.exports = {
  workoutBlocksApiRouter
}
