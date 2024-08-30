import express, { Request, Response } from 'express';
import { paginateArray } from '../../shared/utils';
import WorkoutTemplate from '../../models/workout-template.model';

const workoutTemplatesApiRouter = express.Router();
workoutTemplatesApiRouter.use(express.json());

workoutTemplatesApiRouter.get('/', async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  try {
    const workoutTemplates = await WorkoutTemplate.find();
    res.json(paginateArray(workoutTemplates, Number(limit), Number(page)));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

workoutTemplatesApiRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const workoutTemplate = await WorkoutTemplate.findById(id);
    if (!workoutTemplate) {
      return res.status(404).json({ error: 'Workout template not found' });
    }
    res.json(workoutTemplate);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

workoutTemplatesApiRouter.post('/', async (req: Request, res: Response) => {
  const { name, workout_blocks } = req.body;
  try {
    if (!name || !workout_blocks) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const newWorkoutTemplate = new WorkoutTemplate({ name, workout_blocks });
    await newWorkoutTemplate.save();
    res.status(201).json(newWorkoutTemplate);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

workoutTemplatesApiRouter.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, workout_blocks } = req.body;
  try {
    const workoutTemplate = await WorkoutTemplate.findById(id);
    if (!workoutTemplate) {
      return res.status(404).json({ error: 'Workout template not found' });
    }
    workoutTemplate.name = name;
    workoutTemplate.workout_blocks = workout_blocks;
    await workoutTemplate.save();
    res.json(workoutTemplate);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});

workoutTemplatesApiRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const workoutTemplate = await WorkoutTemplate.findById(id);
    if (!workoutTemplate) {
      return res.status(404).json({ error: 'Workout template not found' });
    }
    await WorkoutTemplate.deleteOne({ _id: workoutTemplate._id });
    res.status(204).send();
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.log(e);
    res.status(500).json({ error: errorMessage });
  }
});

export {
  workoutTemplatesApiRouter
};
