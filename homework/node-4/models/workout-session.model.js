const mongoose = require('mongoose')

const WorkoutSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workout_template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutTemplate',
    required: true
  },
  exercises: [
    {
      exercise_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
      },
      sets: [
        {
          weight: {
            type: Number
          },
          reps: {
            type: Number
          }
        }
      ],
      notes: {
        type: String
      }
    }
  ],
  started_at: {
    type: Date,
    required: true
  },
  ended_at: {
    type: Date,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema)
