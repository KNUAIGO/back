const http = require('http');
const {app, connectDB} = require('./app.js');

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결 후 서버 시작
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});