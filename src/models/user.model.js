const { Model, DataType } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {
    // 회원 가입 부분
    static async isEmailTaken(email) {
        const user = await this.findOne({ where: { email} });
        return !!user;
    }

    static async isPhoneTaken(phone) {
        const user = await this.findOne({ where: { phone} });
        return !!user;
    }

    static isPasswordMatch(password) {
        return bcrypt.compare(password, this.password);
    }
}

User.init({
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    name: {
        type: DataType.STRING(100),
        allowNull: false,
    },
    age: {
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
        }
    },
    phone: {
        type: DataType.STRING(15),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataType.STRING(255),
        allowNull: false,
        set(value) {
            const hashedPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashedPassword);
        },
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
})