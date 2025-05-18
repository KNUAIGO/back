const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
}

const DEFAULT_EXPIRES_IN = '1d';

const generateToken = (userId, additionalPayload = {}) => { 
    return jwt.sign(
        { id: userId, ...additionalPayload },
        JWT_SECRET_KEY,
        { expiresIn: JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN }
    );
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = {
    generateToken,
    verifyToken
};