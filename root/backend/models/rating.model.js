const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    tutee: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutee',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    tutor: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutor',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Rating = mongoose.model('rating', RatingSchema);