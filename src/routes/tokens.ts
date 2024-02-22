import express from 'express';
import { SuccessResponse } from '../core/ApiResponse';
import validator from '../helpers/validator';
import cardSchema from '../schemas/cards';
import asyncHandler, { RequestCustom } from '../helpers/asyncHandler';
import { createToken } from '../core/JwtAes';
import { redisServer } from "../databases/redis";
import { tokenExpired } from '../config';

const router = express.Router();

router.get( '/', asyncHandler(async (req: RequestCustom, res) => {
    new SuccessResponse('Sucess', {
    }).send(res);
  }),
);

  
router.post( '/', validator(cardSchema.cards), asyncHandler(async (req: RequestCustom, res) => {

    const token = createToken(req.body, tokenExpired)
    if(req.key){
      await redisServer.setEx(req.key, 60, token);
    }
    
    new SuccessResponse('Success Token', {
      token
    }).send(res);

  }),
);

export default router;
