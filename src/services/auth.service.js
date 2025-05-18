const userRepository = require('../db/repositories/user.repository');

class AuthService {
    constructor() {
        this.userRepository = userRepository;
    }

    async register(userData) {
        try {
            const user = await this.userRepository.createUser(userData);
            return user;
        } catch (error) {
            throw new Error('Registration failed: ' + error.message);
        }
    }
}

module.exports = new AuthService();