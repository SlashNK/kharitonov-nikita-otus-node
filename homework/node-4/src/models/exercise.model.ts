import { Schema, model, Document } from 'mongoose';

interface IExercise extends Document {
  name: string;
  description: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Exercise = model<IExercise>('Exercise', ExerciseSchema);

export default Exercise;
