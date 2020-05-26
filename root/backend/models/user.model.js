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
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['tutor', 'tutee', 'admin'],
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }

});

UserSchema.index({
    name: 1,
    email: 1
});

module.exports = User = mongoose.model('user', UserSchema);