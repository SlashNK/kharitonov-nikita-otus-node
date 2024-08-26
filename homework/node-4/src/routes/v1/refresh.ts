import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model';

const refreshTokenApiRouter = express.Router();

refreshTokenApiRouter.use(express.json());

refreshTokenApiRouter.get('/', async (req: express.Request, res: express.Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  console.log('Refresh token received:', cookies.jwt);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    return res.sendStatus(401);
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY as string,
    (err: any | null, decoded: any) => {
      if (
        err ||
        foundUser.username !== (decoded as any).username ||
        foundUser.email !== (decoded as any).email
      ) {
        return res.sendStatus(403);
      }
      const accessToken = jwt.sign(
        { username: foundUser.username, email: foundUser.email },
        process.env.ACCESS_TOKEN_SECRET_KEY as string,
        { expiresIn: '30s' }
      );
      res.json({ accessToken });
    }
  );
});

export { refreshTokenApiRouter };
