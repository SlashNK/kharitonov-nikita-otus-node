import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
import { Document } from 'mongoose';

const authApiRouter = express.Router();
authApiRouter.use(express.json());

interface JwtPayload {
  username: string;
  email: string;
}

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
}

authApiRouter.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const foundUser = await User.findOne({ username }) as UserDocument | null;

  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username, email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      { expiresIn: '30s' }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username, email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    await foundUser.updateOne({ $set: { refreshToken } });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unauthorized
  }
});

export { authApiRouter };
