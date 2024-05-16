const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';
import { User } from './interfaces';
require('dotenv').config();

interface RequestWithUser extends Request {
  user: User;
}

export const authenticateJWT = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader: string | undefined = req.headers.authorization;
  if (authHeader) {
    const token: string = authHeader.split(' ')[1];
    jwt.verify(
      token,
      process.env.SECRET_KEY,
      (err: Error, user: User): void | Response => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      },
    );
  } else {
    res.sendStatus(401);
  }
};

export const generateJWT = (user: User): string => {
  const payload: User = user;
  const token: string = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: 50000,
  });
  return token;
};
