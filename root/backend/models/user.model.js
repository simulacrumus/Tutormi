const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 30,
        min: 8
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['tutor', 'tutee'],
        required: true
    }
});

module.exports = User = mongoose.model('user', UserSchema);