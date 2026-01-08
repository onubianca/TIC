import {validationResult} from "express-validator";
import {User} from "../models/User.js";
import { hashPassword, comparePassword, generateToken } from "../config/authHelpers.js";

export async function register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {
        const {email, password, name} = req.body;
        const role = req.body.role || 'user';

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await hashPassword(password);
        const userId = await User.create({ email, password: hashedPassword, name, role });

        res.status(201).json({ message: 'User registered successfully', userId });

        const token = generateToken(userId, email, role);

        res.status(201).json({ message: 'User registered successfully', token, user:{userId, email, name, role} });
    
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
}

export async function login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {email, password} = req.body;
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user.userId, user.email, user.role);

        res.json({ message: 'Login successful', token, user: { userId: user.userId, email: user.email, name: user.name, role: user.role } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
}