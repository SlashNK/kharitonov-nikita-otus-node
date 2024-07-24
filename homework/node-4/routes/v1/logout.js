const express = require('express')
const User = require('../../models/user.model')
const logoutApiRouter = express.Router()
logoutApiRouter.use(express.json())

const removeCookie = (res) => {
  res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
}
logoutApiRouter.get('/', async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) {
    return res.sendStatus(401)
  }
  console.log('Refresh token received:', cookies.jwt)
  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({ refreshToken })
  if (!foundUser) {
    removeCookie(res)
    res.sendStatus(403)
    return
  }
  foundUser.updateOne({ $set: { refreshToken: null } })
  removeCookie(res)
  res.sendStatus(204)
})
module.exports = {
  logoutApiRouter
}
