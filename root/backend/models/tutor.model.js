const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    bio: {
        type: String,
        max: 300
    },
    courses: {
        type: [String],
        required: true
    },
    appointments: [{
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'appointment'
        }
    }],
    followers: [{
        tutee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutee'
        }
    }],
    ratings: [{
        rate: {
            tutee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'tutee'
            },
            value: {
                type: Number,
                default: 0.0
            }
        }
    }],
    rating: {
        type: Number,
        default: 0.0
    },
    languages: {
        type: [String],
        required: true
    },
    blockedTutees: [{
        tutee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutee'
        }
    }],
    availableHours: [{
        time: {
            start: {
                type: Date,
                required: true
            },
            end: {
                type: Date,
                required: true
            }
        }
    }],
    social: {
        linkedin: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        youtube: {
            type: String
        }
    },
    location: {
        type: String,
        max: 30
    }
});

module.exports = Tutor = mongoose.model('tutor', TutorSchema);