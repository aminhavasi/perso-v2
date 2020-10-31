const express = require('express');
const User = require('../models/user');
const router = express.Router();
const persianDate = require('persian-date');
const { registerValidator } = require('./../validator/authValidator');
const { errorHandler } = require('./../helper/errors');
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

module.exports = router;
