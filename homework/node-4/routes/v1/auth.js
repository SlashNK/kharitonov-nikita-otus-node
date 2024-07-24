const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/user.model')
const authTokenApiRouter = express.Router()
authTokenApiRouter.use(express.json())

authTokenApiRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' })
  }
  const foundUser = await User.findOne({ username })
  if (!foundUser) {
    res.sendStatus(401)
    return
  }
  const match = await bcrypt.compare(password, foundUser.password)
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username, email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '30s' }
    )
    const refreshToken = jwt.sign(
      { username: foundUser.username, email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '1d' }
    )
    await foundUser.updateOne({ $set: { refreshToken } })
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ accessToken })
  } else {
    res.sendStatus(401)
  }
})

module.exports = {
  authApiRouter: authTokenApiRouter
}
