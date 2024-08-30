import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface CustomRequest extends Request {
  user?: string | JwtPayload;  
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Access denied. Invalid token.' });
    }

    req.user = decoded;
    next();
  });
};

export default verifyJWT;
