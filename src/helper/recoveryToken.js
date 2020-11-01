const jwt = require('jsonwebtoken');
const genRecoveryToken = (user) => {
    const token = jwt
        .sign(
            {
                _id: user._id.toHexString(),
            },
            process.env.RECOVERYTOKEN
        )
        .toString();
    return token;
};
module.exports = genRecoveryToken;
