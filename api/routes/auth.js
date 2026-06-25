import express from 'express';
import {register, login} from '../controllers/authController.js';
import {registerValidator, loginValidator} from '../validators/authValidator.js';

const router = express.Router();    

router.post('/register', registerValidator, register);

export default router;