const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    tutee: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutee'
        },
        name: {
            type: String,
            required: true
        }
    },
    tutor: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutor'
        },
        name: {
            type: String,
            required: true
        }
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
        default: Date.now
    }
});

module.exports = Appointment = mongoose.model('appointment', AppointmentSchema);