import { admin } from '../config/firebaseConfig.js';

export async function validateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'Access token missing' });
        }
    
        // Verify the Firebase ID token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Bind claims and user ID to req.user for compatibility with downstream controllers
        req.user = {
            userID: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || 'user' // Custom claim role defaults to 'user'
        };
        
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ message: 'Invalid or expired token' });
    }   
}

export function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
}