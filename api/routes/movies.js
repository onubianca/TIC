import express from 'express';
import {validateToken, requireAdmin} from '../middleware/auth.js';
import * as movieController from '../controllers/movieController.js';
import {movieValidator} from '../validators/movieValidator.js';

const router = express.Router();

router.get('/', movieController.getMovies);
router.get('/:movieId', movieController.getMovieById);
router.post('/', validateToken, requireAdmin, movieValidator, movieController.createMovie);
router.put('/:movieId', validateToken, requireAdmin, movieValidator, movieController.updateMovie);
router.delete('/:movieId', validateToken, requireAdmin, movieController.deleteMovie);

export default router;