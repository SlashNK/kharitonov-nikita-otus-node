import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorkoutTemplateDocument extends Document {
  name: string;
  workout_blocks: mongoose.Types.ObjectId[];
}

const WorkoutTemplateSchema = new Schema<IWorkoutTemplateDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    workout_blocks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutBlock',
      required: true,
    }],
  },
  { timestamps: true }
);

const WorkoutTemplateModel: Model<IWorkoutTemplateDocument> = mongoose.model<IWorkoutTemplateDocument>('WorkoutTemplate', WorkoutTemplateSchema);

export default WorkoutTemplateModel;
