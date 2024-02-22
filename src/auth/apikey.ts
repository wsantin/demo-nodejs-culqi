import express from 'express';
import { ForbiddenError } from '../core/ApiError';
import AuthSchema from '../schemas/auth';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler, { RequestCustom } from '../helpers/asyncHandler';
import { Header } from '../core/utils';

const router = express.Router();

export default router.use(
  validator(AuthSchema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: RequestCustom, res, next) => {
    const key = req.headers[Header.API_KEY]?.toString();
    if (key !== process.env.apiKey) throw new ForbiddenError();
    
    req.key = key;

    return next();
  }),
);
