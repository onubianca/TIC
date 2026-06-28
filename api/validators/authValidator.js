import { body } from 'express-validator';

export const registerValidator = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
];
