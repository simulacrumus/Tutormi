const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const Tutee = require("../../models/tutee.model");
const Tutor = require("../../models/tutor.model");
const User = require("../../models/user.model");
const {
  check,
  validationResult
} = require("express-validator");

// @route   GET api/tutees/me
// @desc    Get current user's tutee profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const tutee = await
      Tutee.findOne({
        user: req.user.user.id,
      })
      .populate('user', ['name', 'email', 'date'])
      .populate('appointments')
      .populate({
        path: 'favorites',
        select: ['-social', '-bookingRange', '-followers', '-rating', '-languages', '-blockedTutees', '-blockedBy', '-active', '-bio', '-location', '-ratings', '-date'],
        populate: {
          path: 'user',
          select: 'name',
          model: User
        }
      })
      .populate('ratings')

    if (!tutee) {
      return res.status(400).json({
        msg: "There is no tutee profile for this user",
      });
    }

    res.json(tutee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/tutees/
// @desc    Create or update user's tutee profile
// @access  Private
router.post(
  "/",
  auth, [
  check("languages", "Language is required").not().isEmpty(),
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      bio,
      languages,
      social,
      location,
      name
    } = req.body;

    const tuteeProfileFields = {
      user: req.user.user.id,
      location,
      bio,
      social,
      languages: Array.isArray(languages) ? languages : languages.split(',').map((language) => language.trim()),
    };

    try {

      query = {}
      query.profile = true;
      if (name) {
        query.name = name;
      }
      //change user name and profile fields
      await User.findOneAndUpdate({
        _id: req.user.user.id
      }, query)

      const tutee = await Tutee.findOneAndUpdate({
        user: req.user.user.id
      }, {
        $set: tuteeProfileFields
      }, {
        new: true,
        upsert: true
      })
        .populate('user', ['name', 'email', 'type'])
        .populate('appointments')
        .populate('ratings');

      return res.json(tutee);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/tutees
// @desc    Get all tutee profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Tutee.find().populate("user", ["name", "email"]).populate('appointments');;
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("*tuteee profile* Server Error");
  }
});

// @route   GET api/tutees/user/:id
// @desc    Get tutee profile by tutee ID
// @access  Public
router.get("/user/:id", async (req, res) => {
  try {
    const profile = await Tutee.findOne({
      _id: req.params.id,
    })
      .populate("user", ["name", "email"])
      .populate('appointments')
      .populate('ratings');
    if (!profile) {
      return res.status(400).json({
        msg: "Tutee not found"
      });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({
        msg: "Tutee not found"
      });
    }
    res.status(500).send("*tuteee profile* Server Error");
  }
});

// @route   DELETE api/tutees
// @desc    Delete tutee profile, user & posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove users posts

    // Remove profile
    await Tutee.findOneAndRemove({
      user: req.user.user.id
    });

    // Remove User
    await User.findOneAndRemove({
      _id: req.user.user.id
    });
    res.json({
      msg: "Tutee deleted"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("*tuteee profile* Server Error");
  }
});

// @desc     Test for adding tutees
router.post(
  '/addtutees',
  async (req, res) => {

    const tutees = req.body;
    for (let index = 0; index < tutees.length; index++) {
      let {
        bio,
        languages,
        linkedin,
        twitter,
        facebook,
        instagram,
        location,
        user
      } = tutees[index];

      let tuteeProfileFields = {
        user: user,
        location: location,
        bio: bio,
        languages: Array.isArray(languages) ?
          languages : languages.split(',').map((language) => language.trim())
      };
      // Build social object and add to profileFields
      let social = {
        linkedin,
        twitter,
        facebook,
        instagram
      };

      for (let [key, value] of Object.entries(social)) {
        if (value && value.length > 0)
          social[key] = value;
      }

      tuteeProfileFields.social = social;

      try {
        // Using upsert option (creates new doc if no match is found):
        let tutee = await Tutee.findOneAndUpdate({
          user: user
        }, {
          $set: tuteeProfileFields
        }, {
          new: true,
          upsert: true
        });
      } catch (err) {
        console.error(err.message);

      }
    }
    res.json({
      message: 'tutees added'
    });
  }
);

// @route   PUT api/tutees/favorites/:id
// @desc    Add tutor to favorites list
// @access  Private
router.put('/favorites/:id', auth, async (req, res) => {

  const tutorId = req.params.id;

  try {

    const tutor = await Tutor.findById(tutorId)

    if (!tutor) {
      return res.status(400).json({
        message: "There's no tutor with this id"
      })
    }

    const tutee = await Tutee.findOneAndUpdate({
      user: req.user.user.id
    }, {
      $addToSet: {
        favorites: tutorId
      }
    })

    if (!tutee) {
      return res.status(400).json({
        msg: "Tutee not found"
      })
    }

    await Tutor.findOneAndUpdate({
      _id: tutorId
    }, {
      $addToSet: {
        followers: tutee._id
      }
    })

    return res.json("Added to favorites")
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/tutees/favorites/:id
// @desc    Remove tutor from favorites list
// @access  Private
router.delete('/favorites/:id', auth, async (req, res) => {

  const tutorId = req.params.id;

  try {

    const tutor = await Tutor.findById(tutorId)

    if (!tutor) {
      return res.status(400).json({
        message: "There's no tutor with this id"
      })
    }

    const tutee = await Tutee.findOneAndUpdate({
      user: req.user.user.id
    }, {
      $pull: {
        favorites: tutorId
      }
    })

    if (!tutee) {
      return res.status(400).json({
        message: "Tutee not found"
      })
    }

    await Tutor.findOneAndUpdate({
      _id: tutorId
    }, {
      $pull: {
        followers: tutee._id
      }
    })

    return res.json({
      msg: "Removed from favorites"
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;