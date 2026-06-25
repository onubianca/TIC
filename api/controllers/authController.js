import { validationResult } from 'express-validator';
import { admin } from '../config/firebaseConfig.js';

export async function register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password, name } = req.body;
        const role = 'user';

        // 1. Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        const uid = userRecord.uid;

        // 2. Set Custom User Claims to define user roles
        await admin.auth().setCustomUserClaims(uid, { role });

        // 3. Create a profile document in Firestore (for watchlists, etc.)
        await admin.firestore().collection('users').doc(uid).set({
            name,
            email,
            role,
            watchlist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 4. Generate a Firebase Custom Token for immediate login on the frontend
        const customToken = await admin.auth().createCustomToken(uid, { role });

        res.status(201).json({
            message: 'User registered successfully',
            customToken,
            user: { userId: uid, email, name, role }
        });
    
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
}

// Deprecate backend login; frontend will authenticate directly with Firebase SDK
export async function login(req, res) {
    res.status(405).json({ 
        message: 'Login must be performed directly on the client using the Firebase Web SDK.' 
    });
}