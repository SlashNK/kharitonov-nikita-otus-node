import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISet {
  weight?: number;
  reps?: number;
}

export interface IExerciseDetail {
  exercise_id: mongoose.Types.ObjectId;
  sets: ISet[];
  notes?: string;
}

export interface IWorkoutSessionDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  workout_template_id: mongoose.Types.ObjectId;
  exercises: IExerciseDetail[];
  started_at: Date;
  ended_at: Date;
}

const WorkoutSessionSchema = new Schema<IWorkoutSessionDocument>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workout_template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutTemplate',
      required: true,
    },
    exercises: [
      {
        exercise_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true,
        },
        sets: [
          {
            weight: {
              type: Number,
            },
            reps: {
              type: Number,
            },
          },
        ],
        notes: {
          type: String,
        },
      },
    ],
    started_at: {
      type: Date,
      required: true,
    },
    ended_at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const WorkoutSessionModel: Model<IWorkoutSessionDocument> = mongoose.model<IWorkoutSessionDocument>('WorkoutSession', WorkoutSessionSchema);

export default WorkoutSessionModel;
