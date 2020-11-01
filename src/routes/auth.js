const express = require('express');
const User = require('../models/user');
const router = express.Router();
const persianDate = require('persian-date');
const {
    registerValidator,
    loginValidator,
    recoveryValidator,
    recoveryPassValidator,
} = require('./../validator/authValidator');
const { errorHandler } = require('./../helper/errors');
const genRecoveryToken = require('./../helper/recoveryToken');
const Token = require('../models/loginToken');
const Recovery = require('./../models/recovery');
const sendRecoveryEmail = require('./../helper/emailRecovery');
persianDate.toLocale('en');
const date = new persianDate().format('YYYY/M/DD');
router.post('/register', async (req, res) => {
    try {
        const { error } = await registerValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const usersCount = await User.find().countDocuments();

        if (usersCount > 0) throw errorHandler('Access denied!', 1003);
        else {
            (req.body.adminLevel = 'creator'), (req.body.date = date);
            const newUser = await new User(req.body);
            await newUser.save();
        }
        res.status(200).send();
    } catch (err) {
        if (err.code === 1003) {
            return res.status(403).send(err.message);
        }
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { error } = await loginValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const user = await User.findByCredentials(req.body);
        const token = await user.genAuthToken();
        res.status(200).header('x-auth', token).send();
        if (!user) throw errorHandler('user not found', 1004);

        res.send(req.body);
    } catch (err) {
        if (err.code === 1004) {
            res.status(404).send(err.message);
        } else if (err === 'not') {
            res.status(404).send('email/username or password is incorrect');
        }
    }
});

router.delete('/logout/:id', async (req, res) => {
    try {
        let tokenId = req.params.id;
        if (!tokenId) throw errorHandler('tokenId is not correct', 1000);
        const successDelete = await Token.findOneAndDelete({
            _id: req.params.id,
        });
        if (successDelete) return res.status(200).send('successDelete');
        else throw errorHandler('logout is not success', 1000);
    } catch (err) {
        if (err.code === 1000) res.status(400).send(err.message);
        else {
            console.log(err);
            res.status(400).send('something went wrong');
        }
    }
});

router.post('/recovery', async (req, res) => {
    try {
        const { error } = await recoveryValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let user = null;
        if (req.body.email) {
            user = await User.findOne({ email: req.body.email });
        } else if (req.body.username) {
            user = await User.findOne({ username: req.body.username });
        }
        if (!user) {
            throw errorHandler('username or email not correct', 1004);
        } else {
            const recoveryToken = await genRecoveryToken(user);
            const token = new Recovery({
                user: user._id,
                token: recoveryToken,
            });
            await token.save();
            await sendRecoveryEmail(user, recoveryToken);
            res.status(200).send('recovery email sent!');
        }
    } catch (err) {
        if (err.code === 1004) res.status(404).send(err.message);
        else {
            console.log(err);
            res.status(400).send('something went wrong');
        }
    }
});

router.post('/reset', async (req, res) => {
    try {
        const { error } = await recoveryPassValidator(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let token = await Recovery.findOne({ token: req.query.token });
        if (!token) throw errorHandler('Access denid!', 1004);

        const user = await User.findOne({ _id: token.user });
        user.set({ password: req.body.password });
        await user.save();
        await Recovery.findByIdAndDelete({ _id: token._id });

        res.status(200).send('success change password');
    } catch (err) {
        if (err.code === 1004) res.status(404).send(err.message);
        else {
            res.status(400).send(err);
        }
    }
});

module.exports = router;
