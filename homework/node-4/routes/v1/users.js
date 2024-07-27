const express = require('express')
const { paginateArray, saltPassword } = require('../../shared/utils')
const User = require('../../models/user.model')
const usersApiRouter = express.Router()
usersApiRouter.use(express.json())

usersApiRouter.get('/', async (req, res) => {
  const { page, limit } = req.query
  const users = await User.find()
  res.json(paginateArray(users, limit, page))
})

usersApiRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

usersApiRouter.post('/', async (req, res) => {
  const { username, email, password } = req.body
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Validation failed' })
    }
    const newUser = new User({ username, email, password: await saltPassword(password) })
    await newUser.save()
    res.status(201).json(newUser)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

usersApiRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { username, email } = req.body
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    user.username = username
    user.email = email
    await user.save()
    res.json(user)
  } catch (e) {
    return res.status(500).json({ error: e })
  }
})

usersApiRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    await User.deleteOne({ _id: user._id })
    res.status(204).send()
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: e })
  }
})

module.exports = {
  usersApiRouter
}
