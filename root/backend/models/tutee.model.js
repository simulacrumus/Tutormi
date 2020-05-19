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
  appointments: [{
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "appointment"
        }
    }
  ],
  ratings: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      rate: {
        type: Number,
      }
    }
  ],
  following: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  blockedUsers: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  blockedBy: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  appointments: [
    {
      appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment"
      }
    }
  ],
  languages: {
    type: [String],
    max: 20
  },
  ratings: [
    {
      tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      rate: {
        type: Number
      }
    }
  ],
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

module.exports = Tutee = mongoose.model("tutee", TuteeSchema);