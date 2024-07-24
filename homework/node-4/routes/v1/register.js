const express = require('express')
const User = require('../../models/user.model')
const { saltPassword } = require('../../shared/utils')
const registerApiRouter = express.Router()
registerApiRouter.use(express.json())

registerApiRouter.post('/', async (req, res) => {
  const { username, email, password } = req.body
  console.log(username, email, password)
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Username, Email and password are required.' })
  }
  // check for duplicate usernames in the db
  if ((await User.find({ $or: [{ username }, { email }] })).length) {
    return res.sendStatus(409)
  }
  try {
    const newUser = new User({ username, email, password: await saltPassword(password) })
    newUser.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = {
  registerApiRouter
}
