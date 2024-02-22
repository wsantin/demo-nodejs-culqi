import express from 'express';

import tokens from './tokens'
import cards from './cards'
import apikey from '../auth/apikey';

const router = express.Router();


router.use(apikey);

router.use('/tokens', tokens);
router.use('/cards', cards);

export default router;
