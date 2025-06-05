const userRepository = require('../db/repositories/user.repository');
const config_jwt = require('../config/jwt');
const User = require('../db/models/user.model');

class AuthService {
    constructor() {
        this.userRepository = userRepository;
    }

    // 회원가입
    async register(userData) {
        try {
            const user = await this.userRepository.createUser(userData);

            return user;
        } catch (error) {
            throw new Error('Registration failed: ' + error.message);
        }
    }

    // 로그인
    async login(email, password) {
        try {
            const user = await User.scope('forLogin').findOne({ where: { email } });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            const isPasswordValid = await user.isPasswordMatch(password);

            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            const token = config_jwt.generateToken(user.id, { email: user.email });
            
            return { user, token };
        } catch (error) {
            throw new Error('Login failed: ' + error.message);
        }
    }

    // 아이디 찾기
    async findId(name, phone) {
        try {
            const user = await this.userRepository.getUserByNameAndPhone(name, phone);

            if (!user) {
                throw new Error('User not found');
            }

            return user.email;
        } catch (error) {
            throw new Error('Find ID failed: ' + error.message);
        }
    }
}

module.exports = new AuthService();