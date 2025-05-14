require('dotenv').config();
const express = require('express');
const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;