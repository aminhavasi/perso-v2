const mongoose = require('mongoose');
const db = () => {
    mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
};

module.exports = { db };
