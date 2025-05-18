const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index.js');
const db = require('./config/database.js');

// Express 애플리케이션 실행
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 라우트 설정
//app.use('/api', routes);

// 데이터베이스 연결 함수
async function connectDB() {
  try {
    await db.connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process if DB connection fails
  }
}

// 모듈 exports
module.exports = {
  app,
  connectDB,
};