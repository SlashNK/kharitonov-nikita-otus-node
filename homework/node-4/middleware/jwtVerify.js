const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Access denied. Invalid token.' })
    }
    req.user = decoded
    next()
  })
}

module.exports = verifyJWT
