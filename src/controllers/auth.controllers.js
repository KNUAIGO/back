const authService = require('../services/auth.service');
const { registerSchema, loginSchema, findIdSchema } = require('../validations/auth.validation');

class AuthController {
    // 회원가입
    async register(req, res, next) {
        try {
            const { error } = registerSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const user = await authService.register(req.body);

            return res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            next(error);

            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 로그인
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { error } = loginSchema.validate({ email, password });

            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { user, token } = await authService.login(email, password);

            return res.status(200).json({ message: 'Login successful', user, token });
        } catch (error) {
            next(error);
            
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 아이디 찾기
    async findId(req, res, next) {
        try {
            const { name, phone } = req.body;
            const { error } = findIdSchema.validate({ name, phone });

            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const email = await authService.findId(name, phone);

            if (!email) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ message: 'User found', email });
        } catch (error) {
            next(error);
            
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AuthController();