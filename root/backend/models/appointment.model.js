const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    tutee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutor'
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutee'
    },
    time: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    subject: {
        type: String
    },
    note: {
        type: String
    },
    date: {
        type: Date,
        default: Date.nowx
    }
});

module.exports = Appointment = mongoose.model('appointment', AppointmentSchema);