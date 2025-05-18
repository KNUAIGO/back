const authService = require('../services/auth.service');
const { registerSchema } = require('../validations/auth.validation');

class AuthController {
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
}

module.exports = new AuthController();