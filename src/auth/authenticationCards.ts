import express from 'express';
import {
  AuthFailureError,
  AccessTokenError,
  TokenExpiredError,
  BadTokenError
} from '../core/ApiError';
import { verifyToken } from '../core/JwtAes'
import validator, { ValidationSource } from '../helpers/validator';
import authSchema from '../schemas/auth';
import asyncHandler, { RequestCustom } from '../helpers/asyncHandler';

const router = express.Router();

export default router.use(
  validator(authSchema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: RequestCustom, res, next) => {

    let authorization = req.headers.authorization;
    console.log("accessToken")

    if (!req.headers.authorization) throw new AuthFailureError('Invalid Authorization');
    if (!req.headers.authorization.startsWith('Bearer '))
      throw new AuthFailureError('Invalid Authorization');
      authorization = req.headers.authorization.split(' ')[1];

    try {
      const {payload} = await verifyToken(authorization);
      console.log("payload: ",payload)
      req.token = {
        ...payload,
      }
      
      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }),
);
