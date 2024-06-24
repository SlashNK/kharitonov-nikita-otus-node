const express = require('express')
const { generateId, paginateArray } = require('../../shared/utils')

const usersApiRouter = express.Router()
const users = []
usersApiRouter.use(express.json())

usersApiRouter.get('/', (req, res) => {
  const { page, limit } = req.query
  res.json(paginateArray(users, limit, page))
})

usersApiRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const user = users.find((user) => user.id === id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json(user)
})

usersApiRouter.post('/', (req, res) => {
  const { username, email } = req.body
  if (!username || !email) {
    return res.status(400).json({ error: 'Validation failed' })
  }
  const newUser = { id: generateId(), username, email }
  users.push(newUser)
  res.status(201).json(newUser)
})

usersApiRouter.put('/:id', (req, res) => {
  const { id } = req.params
  const { username, email } = req.body
  const user = users.find((user) => user.id === id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  user.username = username
  user.email = email
  res.json(user)
})

usersApiRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' })
  }
  users.splice(index, 1)
  res.status(204).send()
})

module.exports = {
  usersApiRouter
}
