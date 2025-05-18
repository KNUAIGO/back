const { Model, DataTypes, Op } = require('sequelize');
const { sequelize } = require('../../config/database');
const bcrypt = require('bcrypt');

class User extends Model {
    // 이메일 중복 확인
    static async isEmailTaken(email, excludeUserId = null) {
        const where = { email };
        if (excludeUserId) {
            where.id = { [Op.ne]: excludeUserId };
        }
        const user = await this.findOne({ where });
        return !!user;
    }

    // 전화번호 중복 확인
    static async isPhoneTaken(phone, excludeUserId = null) {
        const where = { phone };
        if (excludeUserId) {
            where.id = { [Op.ne]: excludeUserId };
        }
        const user = await this.findOne({ where });
        return !!user;
    }

    // 비밀번호 검증 (인스턴스 메서드로 변경)
    async isPasswordMatch(password) {
        return bcrypt.compare(password, this.password);
    }

    // JSON 변환 시 password 제외
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: '유효한 이메일 주소를 입력해주세요'
            },
            notEmpty: {
                msg: '이메일은 필수 입력 항목입니다'
            }
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: '이름은 필수 입력 항목입니다'
            },
            len: {
                args: [2, 100],
                msg: '이름은 2자 이상 100자 이하로 입력해주세요'
            }
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: '나이는 0 이상이어야 합니다'
            },
            isInt: {
                msg: '나이는 정수로 입력해주세요'
            }
        }
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
            is: {
                args: /^[0-9]{10,15}$/,
                msg: '유효한 전화번호 형식이 아닙니다'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [8, 255],
                msg: '비밀번호는 8자 이상이어야 합니다'
            }
        },
        set(value) {
            if (value) {
                const hashedPassword = bcrypt.hashSync(value, 10);
                this.setDataValue('password', hashedPassword);
            }
        },
    },
    region: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: '지역은 필수 입력 항목입니다'
            }
        }
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    paranoid: true, // 소프트 삭제 활성화
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['phone'] },
        { fields: ['name'] }, // 이름 검색을 위한 인덱스
        { fields: ['region'] } // 지역 검색을 위한 인덱스
    ],
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password'] }
        },
    },
    hooks: {
        afterCreate: (user) => {
            console.log(`User ${user.email} created`);
        }
    }
});

module.exports = User;