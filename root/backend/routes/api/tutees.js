const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const Tutee = require("../../models/tutee.model");
const User = require("../../models/user.model");
const { check, validationResult } = require("express-validator");

// @route   GET api/tutees/me
// @desc    Get current user's tutee profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const tutee = await 
      Tutee.findOne({
        user: req.user.user.id,
      }).populate('user', ['name', 'email', 'date']);
    

    if (!tutee) {
      return res.status(400).json({
        msg: "Whoops! There is no tutee profile for this user",
      });
    }

    res.json(tutee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("*tutees* Server Error");
  }
});

// @route   GET api/tutees
// @desc    Create or update user's tutee profile
// @access  Private
router.post(
  "/",
  [auth, [check("languages", "Language is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      bio,
      languages,
      location,
      linkedin,
      twitter,
      facebook,
      instagram,
    } = req.body;

    // Build tutee profile object
    const tuteeProfileFields = {};
    tuteeProfileFields.user = req.user.user.id;
    if (bio) tuteeProfileFields.bio = bio;
    if (languages) {
      tuteeProfileFields.languages = languages
        .split(",")
        .map((languages) => languages.trim());
    }
    console.log(tuteeProfileFields.languages);

    if (location) tuteeProfileFields.location = location;

    //Build social object
    tuteeProfileFields.social = {};
    if (linkedin) tuteeProfileFields.social.linkedin = linkedin;
    if (twitter) tuteeProfileFields.social.twitter = twitter;
    if (facebook) tuteeProfileFields.social.facebook = facebook;
    if (instagram) tuteeProfileFields.social.instagram = instagram;

    try {
      let profile = await Tutee.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Tutee.findOneAndUpdate(
          { user: req.user.id },
          { $set: tuteeProfileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Tutee(tuteeProfileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("*tuteee profile* Server Error");
    }
  }
);

// @route   GET api/tutees
// @desc    Get all tutee profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Tutee.find().populate("user", ["name", "email"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("*tuteee profile* Server Error");
  }
});

// @route   GET api/tutees/user/:user_id
// @desc    Get tutee profile by user ID
// @access  Public
router.get("/user/:id", async (req, res) => {
  try {
    const profile = await Tutee.findOne({
      user: req.params.id,
    }).populate("user", ["name", "email"]);
    if (!profile) {
      return res.status(400).json({ msg: "Tutee not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Tutee not found" });
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
    await Tutee.findOneAndRemove({ user: req.user.user.id });

    // Remove User
    await User.findOneAndRemove({ _id: req.user.user.id });
    res.json({ msg: "Tutee deleted" });
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

module.exports = router;
