const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const {
  DEFAULT_QUERY_LIMIT,
  DEFAULT_QUERY_PAGE
} = require('./constants')
const generateId = () => {
  return uuidv4()
}
const paginateArray = (array, limit, page) => {
  const parsedLimit = parseInt(limit) || DEFAULT_QUERY_LIMIT
  const parsedPage = parseInt(page) || DEFAULT_QUERY_PAGE
  const startIndex = (parsedPage - 1) * parsedLimit
  const endIndex = startIndex + parsedLimit
  return array.slice(startIndex, endIndex)
}

const saltPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

module.exports = {
  generateId,
  paginateArray,
  saltPassword
}
