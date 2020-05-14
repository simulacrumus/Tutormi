const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    about: {
        type: String,
        max: 300
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
        tutee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutee'
        },
        rate: {
            type: mongoose.Schema.Types.Decimal128
        }
    }],
    rating: {
        type: mongoose.Schema.Types.Decimal128
    },
    languages: [{
        language: {
            type: String
        }
    }],
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
        }
    }
});

module.exports = Tutor = mongoose.model('tutor', TutorSchema);