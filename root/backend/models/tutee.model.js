const mongoose = require('mongoose');

const TuteeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    languages: [{
        language: {
            type: String,
            max: 20
        }
    }],
    ratings: [{
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutor'
        },
        rate: {
            type: Number
        }
    }],
    followingTutors: [{
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutor'
        }
    }],
    blockedTutors: [{
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutor'
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

module.exports = Tutee = mongoose.model('tutee', TuteeSchema);