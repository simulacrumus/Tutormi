const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TuteeSchema = new Schema({
    // tuteeName: {
    //     type: Object,
    //     firstName: {
    //         type: String,
    //         required: true
    //     },
    //     lastName: {
    //         type: String,
    //         required: true
    //     }
    // },
    // about: {
    //     type: String
    // },
    // social: {
    //     facebook: String,
    //     twitter: String,
    //     linkedIn: String
    // },
    // appointments: [{
    //     tutorID: {
    //         type: String,
    //         required: true
    //     },
    //     timeBlock: {
    //         startTime: {
    //             type: Date,
    //             default: Date.now
    //         },
    //         endTime: {
    //             type: Date,
    //             required: true
    //         }
    //     },
    //     subject: {
    //         type: String,
    //         required: true
    //     },
    //     note: String

    // }],
    // languages: [{
    //     language: String
    // }],
    // favoriteTutors: [{
    //     tutorID: String
    // }],
    // blockedTutors: [{
    //     _id: String
    // }]
    name: {
        type: String,
        required: true
    }
});

const Tutee = mongoose.model('Tutee', TuteeSchema);
module.exports = Tutee;