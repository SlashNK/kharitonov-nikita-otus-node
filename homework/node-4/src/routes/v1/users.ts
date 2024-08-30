import express, { Request, Response } from 'express';
import { paginateArray, saltPassword } from '../../shared/utils';
import User from '../../models/user.model';

const usersApiRouter = express.Router();

usersApiRouter.use(express.json());

usersApiRouter.get('/', async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const users = await User.find();
  res.json(paginateArray(users, limit as string, page as string));
});

usersApiRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
});

usersApiRouter.post('/', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const hashedPassword = await saltPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
});

usersApiRouter.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username;
    user.email = email;
    await user.save();
    res.json(user);
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
});

usersApiRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await User.deleteOne({ _id: user._id });
    res.status(204).send();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: (e as Error).message });
  }
});

export { usersApiRouter };
