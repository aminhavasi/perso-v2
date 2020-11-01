const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
        index: {
            expires: 3600 * 24,
        },
    },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
