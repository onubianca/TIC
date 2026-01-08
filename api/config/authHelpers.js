import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export async function comparePassword(password, hashedPassword) {  
    return await bcrypt.compare(password, hashedPassword);
};
  
export function generateToken(userID, email, role = 'user') {
    return jwt.sign({ userID, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});
};