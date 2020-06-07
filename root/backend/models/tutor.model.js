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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointment'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutee'
    }],
    profilePic: {
        type: String,
        default: 'default-profile-pic.png'
    },
    coverPic: {
        type: String,
        default: 'default-cover-pic.png'
    },
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutee'
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutee'
    }],
    blockedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutee'
    }],
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
    },
    bookingRange: {
        minimum: {
            type: Number,
            min: 0,
            max: 22,
            default: 8
        },
        maximum: {
            type: Number,
            min: 1,
            max: 23,
            default: 20
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


TutorSchema.index({
    user: 1,
    rating: 1
});

TutorSchema.post('find', (result) => {
    // if (err) {
    //     console.log(err)
    // }
    // let totalRate = 0;
    // let numberOfRates;
    // document.ratings.forEach(rate => {
    //     rate.value += totalRate;
    //     numberOfRates++;
    // })
    // console.log('Rating' + (totalRate / numberOfRates))
    console.log(result)
})

module.exports = Tutor = mongoose.model('tutor', TutorSchema);