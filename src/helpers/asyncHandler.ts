import { Request, Response, NextFunction } from 'express';


export interface RequestCustom extends Request {
  token?: any;
  key?: string;
}

type AsyncFunction = (
  req: RequestCustom,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export default (execution: AsyncFunction) =>
  (req: RequestCustom, res: Response, next: NextFunction) => {
    execution(req, res, next).catch(next);
  };
