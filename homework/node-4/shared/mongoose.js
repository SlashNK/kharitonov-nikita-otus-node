const mongoose = require('mongoose')

async function connectToMongoDB (address) {
  try {
    await mongoose.connect(
      address || 'mongodb://127.0.0.1:27017/workout-logger'
    )
    console.log('Connected to MoуngoDB Server successfully')
  } catch (error) {
    console.error(`Connection to MongoDB failed with error ${error}`)
    process.exit(1)
  }
}
async function disconnectFromMongoDB () {
  return mongoose.connection.close(false)
}

module.exports = { connectToMongoDB, disconnectFromMongoDB }
