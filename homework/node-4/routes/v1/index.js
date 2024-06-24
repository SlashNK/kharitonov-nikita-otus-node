const express = require('express')
const usersRouter = require('./users')
const router = express.Router()

router.get('/', usersRouter)

module.exports = router
