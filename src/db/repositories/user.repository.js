const User = require('../models/user.model');

class UserRepository {
    async createUser(userData) {
        try {
            if(await User.isEmailTaken(userData.email)) {
                throw new Error('Email already taken');
            }
            if(await User.isPhoneTaken(userData.phone)) {
                throw new Error('Phone already taken');
            }
            return await User.create(userData);
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    async getUserByEmail(email, includePassword = false) {
        const scope = includePassword ? 'withPassword' : undefined;
        
        return await User.scope(scope).findOne({ where: { email } });
    }

    async getUserById(id) {
        return await User.findByPk(id);
    }

    async getUserByPhone(phone) {
        return await User.findOne({ where: { phone } });
    }

    async getUserByNameAndPhone(name, phone) {
        return await User.findOne({ where: { name, phone } });
    }

}

module.exports = new UserRepository();