const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TutorSchema = new Schema({
    tutorName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    about: {
        type: String
    },
    social: {
        type: Object,
        facebook: String,
        twitter: String,
        linkedIn: String
    },
    rating: {
        type: Number
    },
    // weeks: [{
    //     startDate: {
    //         type: Date,
    //     },
    //     week: [{
    //         day: [{
    //             timeSlot: {
    //                 status: String,
    //                 tuteeID: String,
    //                 tutorID: String
    //             }
    //         }]
    //     }]
    // }],
    appointments: [{
        tuteeID: {
            type: String,
            required: true
        },
        timeBlock: {
            startTime: {
                type: Date,
                required: true,
                default: Date.now
            },
            endTime: {
                type: Date,
                required: true
            }
        },
        subject: {
            type: String
        },
        note: {
            type: String
        }

    }],
    languages: [{
        language: {
            type: String
        }
    }],
    blockedTutees: [{
        _id: {
            type: String
        }
    }],
    availableHours: [{
        time: {
            type: Date,
            required: true
        }
    }]
});

const Tutor = mongoose.model('Tutor', TutorSchema);
module.exports = Tutor;