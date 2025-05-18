const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// MySQL2 연결 풀 생성 (기존 SQL 쿼리 직접 실행용)
const createPool = () => {
  return mysqlPromise.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
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
};

// Sequelize 인스턴스 생성 (ORM 사용용)
const createSequelize = () => {
  return new Sequelize(
    process.env.DB_NAME || 'test_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      dialectModule: mysql, // mysql2를 사용하도록 명시
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      timezone: '+09:00',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
  );
};

const db = createPool();
const sequelize = createSequelize();

// 데이터베이스 연결 확인 (강력한 버전)
const connectDB = async () => {
  let connection;
  try {
    // MySQL2 연결 테스트
    connection = await db.getConnection();
    await connection.ping();
    
    // Sequelize 연결 테스트
    await sequelize.authenticate();
    
    console.log('✅ Database connections established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// 트랜잭션 헬퍼 (MySQL2용)
const executeTransaction = async (callback) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    console.log('🔷 MySQL2 transaction started');
    
    const result = await callback(connection);
    
    await connection.commit();
    console.log('✅ MySQL2 transaction committed');
    return result;
  } catch (error) {
    await connection.rollback();
    console.error('❌ MySQL2 transaction rolled back:', error);
    throw error;
  } finally {
    connection.release();
    console.log('🔶 MySQL2 connection released');
  }
};

// Sequelize 트랜잭션 헬퍼
const sequelizeTransaction = async (callback) => {
  const t = await sequelize.transaction();
  
  try {
    console.log('🔷 Sequelize transaction started');
    const result = await callback(t);
    
    await t.commit();
    console.log('✅ Sequelize transaction committed');
    return result;
  } catch (error) {
    await t.rollback();
    console.error('❌ Sequelize transaction rolled back:', error);
    throw error;
  }
};

module.exports = {
  db,
  sequelize,
  raw: mysql, // mysql2 모듈
  connectDB,
  executeTransaction,
  sequelizeTransaction
};