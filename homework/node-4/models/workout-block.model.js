const mongoose = require('mongoose')
const WorkoutBlockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })
module.exports = mongoose.model('WorkoutBlock', WorkoutBlockSchema)
