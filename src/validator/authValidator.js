const Joi = require('joi');
const pattern = /^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/;
const usernamePattern = /^[a-zA-Z_][A-Za-z0-9_]*[a-zA-Z0-9]$/;
const bornDateValidator = /^(13[0-9][0-9]|14[0-4][0-9]|1450)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/;

const registerValidator = (user) => {
    const schema = Joi.object({
        name: Joi.string().required().regex(pattern).min(3).max(255),
        family: Joi.string().required().regex(pattern).min(3).max(255),
        username: Joi.string()
            .required()
            .regex(usernamePattern)
            .min(3)
            .max(255),
        email: Joi.string().email().required().min(5).max(255),
        adminLevel: Joi.string().min(5).max(7).valid('admin', 'creator'),
        password: Joi.string().min(8).max(1024).required(),
        bornDate: Joi.string().regex(bornDateValidator).required(),
    });

    return schema.validate(user);
};

const loginValidator = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(255).regex(usernamePattern),
        email: Joi.string().min(5).max(255),
        password: Joi.string().min(8).max(1024),
    }).xor('email', 'username');

    return schema.validate(user);
};

const recoveryValidator = (body) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email(),
        username: Joi.string().min(3).max(255).regex(usernamePattern),
    }).xor('email', 'username');

    return schema.validate(body);
};
const recoveryPassValidator = (body) => {
    const schema = Joi.object({
        password: Joi.string().min(8).max(1024).required(),
    });
    return schema.validate(body);
};

module.exports = {
    registerValidator,
    loginValidator,
    recoveryValidator,
    recoveryPassValidator,
};
