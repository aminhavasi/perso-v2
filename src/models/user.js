const mongoose = require('mongoose');
const regexValidator = /^(13[0-9][0-9]|14[0-4][0-9]|1450)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255,
    },
    family: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    email: {
        type: String,
        unique: true,
        maxlength: 255,
        minlength: 5,
    },
    adminLevel: {
        type: String,
        default: 'admin',
        required: true,
        minlength: 5,
        maxlength: 7,
        enum: ['admin', 'creator'],
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true,
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return regexValidator.test(v);
            },
        },
    },
    bornDate: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return regexValidator.test(v);
            },
        },
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
