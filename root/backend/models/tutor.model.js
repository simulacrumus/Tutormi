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
    ratings: [{
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tutee'
        },
        rate: {
            type: mongoose.Schema.Types.Decimal128
        }
    }],
    rating: {
        function () {
            let totalRate = 0.0;
            this.ratings.forEach(element => {
                totalRate += element.rate;
            });
            return totalRate / this.ratings.length;
        }
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
        hour: {
            type: Date
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