import express, { Request, Response } from 'express';
import { paginateArray } from '../../shared/utils';
import Exercise from '../../models/exercise.model';
import { Document } from 'mongoose';

const exercisesApiRouter = express.Router();
exercisesApiRouter.use(express.json());

interface ExerciseDocument extends Document {
  name: string;
  description: string;
  type: string;
}

interface PaginateQuery {
  page?: number;
  limit?: number;
}

exercisesApiRouter.get('/', async (req: Request<{}, {}, {}, PaginateQuery>, res: Response) => {
  const { page = 1, limit = 10 } = req.query; 
  try {
    const exercises = await Exercise.find();
    res.json(paginateArray(exercises, limit, page));
  } catch (e) {
    res.status(500).json({ error: 'An error occurred while fetching exercises.' });
  }
});

exercisesApiRouter.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const exercise = await Exercise.findById(id) as ExerciseDocument | null;
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

exercisesApiRouter.post('/', async (req: Request, res: Response) => {
  const { name, description, type } = req.body;
  try {
    if (!name || !description || !type) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const newExercise = new Exercise({ name, description, type }) as ExerciseDocument;
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

exercisesApiRouter.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { name, description, type } = req.body;
  try {
    const exercise = await Exercise.findById(id) as ExerciseDocument | null;
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    exercise.name = name;
    exercise.description = description;
    exercise.type = type;
    await exercise.save();
    res.json(exercise);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

exercisesApiRouter.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const exercise = await Exercise.findById(id) as ExerciseDocument | null;
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    await Exercise.deleteOne({ _id: exercise._id });
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

export { exercisesApiRouter };
