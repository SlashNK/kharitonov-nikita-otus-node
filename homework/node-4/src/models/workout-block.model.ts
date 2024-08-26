import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorkoutBlockDocument extends Document {
  name: string;
  exercises: mongoose.Types.ObjectId[];
  created_at?: Date;
  updated_at?: Date;
}

const WorkoutBlockSchema = new Schema<IWorkoutBlockDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    exercises: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    }],
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const WorkoutBlockModel: Model<IWorkoutBlockDocument> = mongoose.model<IWorkoutBlockDocument>('WorkoutBlock', WorkoutBlockSchema);

export default WorkoutBlockModel;
