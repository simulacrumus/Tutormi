const mongoose = require("mongoose");

const TuteeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  bio: {
    type: String,
    max: 300
  },
  location: {
    type: String,
    max: 25
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutor"
  }],
  blockedTutors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutor"
  }],
  blockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutor"
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment'
  }],
  languages: {
    type: [String],
    max: 20
  },
  profilePic: {
    type: String
  },
  coverPic: {
    type: String
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "tutor"
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
  date: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = Tutee = mongoose.model("tutee", TuteeSchema);