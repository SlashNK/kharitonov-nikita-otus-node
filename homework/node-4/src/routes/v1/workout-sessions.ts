import express, { Request, Response } from 'express';
import WorkoutSession from '../../models/workout-session.model';
import { paginateArray } from '../../shared/utils';
import { Types } from 'mongoose';

const workoutSessionsApiRouter = express.Router();
workoutSessionsApiRouter.use(express.json());

workoutSessionsApiRouter.get('/', async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  try {
    const workoutSessions = await WorkoutSession.find();
    const paginatedSessions = paginateArray(workoutSessions, Number(limit), Number(page));
    res.json(paginatedSessions);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

workoutSessionsApiRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid workout session ID' });
    }

    const session = await WorkoutSession.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' });
    }
    res.json(session);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

workoutSessionsApiRouter.post('/', async (req: Request, res: Response) => {
  const { user_id, workout_template_id, exercises, started_at, ended_at } = req.body;

  if (!user_id || !workout_template_id || !exercises || !started_at || !ended_at) {
    return res.status(400).json({ error: 'Validation failed' });
  }

  try {
    const newSession = new WorkoutSession({
      user_id,
      workout_template_id,
      exercises,
      started_at,
      ended_at,
    });

    await newSession.save();
    res.status(201).json(newSession);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

workoutSessionsApiRouter.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id, workout_template_id, exercises, started_at, ended_at } = req.body;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid workout session ID' });
    }

    const session = await WorkoutSession.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    session.user_id = user_id;
    session.workout_template_id = workout_template_id;
    session.exercises = exercises;
    session.started_at = started_at;
    session.ended_at = ended_at;

    await session.save();
    res.json(session);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

workoutSessionsApiRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid workout session ID' });
    }

    const session = await WorkoutSession.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Workout session not found' });
    }

    await WorkoutSession.deleteOne({ _id: session._id });
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export { workoutSessionsApiRouter };
