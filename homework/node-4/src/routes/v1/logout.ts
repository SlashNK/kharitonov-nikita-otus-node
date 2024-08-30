import express from 'express';
import User from '../../models/user.model';

const logoutApiRouter = express.Router();

const removeCookie = (res: express.Response): void => {
  res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
};

logoutApiRouter.get('/', async (req: express.Request, res: express.Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  console.log('Refresh token received:', cookies.jwt);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    removeCookie(res);
    return res.sendStatus(403);
  }
  await foundUser.updateOne({ $set: { refreshToken: null } });
  removeCookie(res);
  res.sendStatus(204);
});

export { logoutApiRouter };
