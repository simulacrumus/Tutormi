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
    appointments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'appointment'
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    ratings: [{
        tutee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        value: {
            type: Number,
            default: 0.0
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
    blockedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    blockedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    availableHours: {
        type: [Date]
    },
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