const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../../models/user.model')
const authApiRouter = express.Router()
authApiRouter.use(express.json())

authApiRouter.post('/', async (req, res) => {
  const { username, password } = req.bod
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' })
  }
  const foundUser = await User.find({ username })
  if (!foundUser) return res.sendStatus(401)
  const match = await bcrypt.compare(password, foundUser.password)
  if (match) {
    // create JWTs
    res.json({ success: `User ${foundUser.username} is logged in!` })
  } else {
    res.sendStatus(401)
  }
})

module.exports = {
  authApiRouter
}
