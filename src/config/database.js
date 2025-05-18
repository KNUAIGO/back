const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
//const logger = require('../utils/logger.js');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+09:00',
    charset: 'utf8mb4',
    typeCast: (field, next) => {
        if (field.type === 'BIT' && field.length === 1) {
            return field.string() === '1';
        }
        return next();
    },
});

// database 연결 확인
const connectDB = async () => {
    try {
        await db.getConnection();
        //logger.info('Database connected successfully');
    } catch (error) {
        //logger.error('Database connection failed:', error);
        throw error;
    }
}

// 트랜잭션 헬퍼
const executeTransaction = async (callback) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    db,
    connectDB,
    executeTransaction,
};