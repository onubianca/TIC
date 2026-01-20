import express from 'express';
import {validateToken} from '../middleware/auth.js';
import * as watchlistController from '../controllers/watchlistController.js';

const router = express.Router();

router.get('/', validateToken, watchlistController.getWatchlist);
router.post('/', validateToken, watchlistController.addToWatchlist);

export default router;