const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wishList: {
        type: Array,
        default: []
    },
    sellList: {
        type: Array,
        default: []
    }
});

// User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);