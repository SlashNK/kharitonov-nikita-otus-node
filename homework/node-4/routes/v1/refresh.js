const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../../models/user.model')
const refreshTokenApiRouter = express.Router()
refreshTokenApiRouter.use(express.json())

refreshTokenApiRouter.get('/', async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) {
    return res.sendStatus(401)
  }
  console.log('Refresh token received:', cookies.jwt)
  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({ refreshToken })
  if (!foundUser) {
    res.sendStatus(401)
    return
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err, decoded) => {
      if (
        err ||
        foundUser.username !== decoded.username ||
        foundUser.email !== decoded.email
      ) {
        return res.sendStatus(403)
      }
      const accessToken = jwt.sign(
        { username: foundUser.username, email: foundUser.email },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: '30s' }
      )
      res.json({ accessToken })
    }
  )
})
module.exports = {
  refreshTokenApiRouter
}
