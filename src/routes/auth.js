const express = require('express');
const User = require('../models/user');
const router = express.Router();
const persianDate = require('persian-date');
const {
    registerValidator,
    loginValidator,
} = require('./../validator/authValidator');
const { errorHandler } = require('./../helper/errors');
const Token = require('../models/loginToken');
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

module.exports = router;
