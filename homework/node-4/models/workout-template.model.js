const mongoose = require('mongoose')

const WorkoutTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  workout_blocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutBlock',
    required: true
  }]
}, { timestamps: true })

module.exports = mongoose.model('WorkoutTemplate', WorkoutTemplateSchema)
