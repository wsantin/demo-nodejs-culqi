import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import Logger from './core/Logger';
import dotenv from 'dotenv'

import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from './core/ApiError';

dotenv.config()

import { environment } from './config';

import routes from './routes';

const app = express()

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Routes
app.use('/', routes);
app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

//NotFound
app.use((req, res, next) => next(new NotFoundError()));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    Logger.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;

