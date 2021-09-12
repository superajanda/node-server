import { Request, NextFunction, Response } from "express";
import { ERROR_MESSAGES } from "../constants";

export interface IUserContext {
  id: string;
}

export interface IContext {
  user: IUserContext;
}

// TODO: Implement authentication
export function authJwt(jwt: string): IUserContext | undefined {
  if (!jwt) {
    return;
  }
  const user = { id: jwt };
  return user;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Format:  "Bearer <JWT>"
  const header = req.header("Authorization");
  if (!header) {
    res.status(401).json({ message: ERROR_MESSAGES.noHttpAuthHeader });
    return;
  }

  const prefix = "Bearer ";
  if (!header.startsWith(prefix)) {
    res.status(400).json({ message: ERROR_MESSAGES.noHttpAuthHeaderPrefix });
    return;
  }

  const token = header.slice(prefix.length);
  const user = authJwt(token);
  if (!user) {
    res.status(401).json({ message: ERROR_MESSAGES.invalidCredentials });
    return;
  }

  req.context = { user };

  next();
}
