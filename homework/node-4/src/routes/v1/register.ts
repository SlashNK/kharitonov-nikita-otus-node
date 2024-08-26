import express, { Request, Response } from 'express';
import User from '../../models/user.model';
import { saltPassword } from '../../shared/utils';

const registerApiRouter = express.Router();

registerApiRouter.use(express.json());

registerApiRouter.post('/', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Username, Email and password are required.' });
  }

  // Check for duplicate usernames or emails in the database
  if ((await User.find({ $or: [{ username }, { email }] })).length) {
    return res.sendStatus(409);
  }

  try {
    const hashedPassword = await saltPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export { registerApiRouter };
