import { IContext } from "../auth";

declare global {
  namespace Express {
    interface Request {
      context: IContext;
    }
  }
}
