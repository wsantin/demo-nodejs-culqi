import express from 'express';
import { SuccessResponse } from '../core/ApiResponse';
import asyncHandler from '../helpers/asyncHandler';
import authenticationCards from '../auth/authenticationCards'
import { redisServer } from "../databases/redis"
import {
  NoDataError
} from '../core/ApiError';

const router = express.Router();

router.get( '/', authenticationCards, asyncHandler(async (req: any, res) => {
  if(req.key){
    const reply = await redisServer.get(req.key);
    if(!reply) throw new NoDataError('Not found cards');
  }

  delete req.token.cvv
  new SuccessResponse('Success', {
      ...req.token
    }).send(res);
  }),
);

export default router;
