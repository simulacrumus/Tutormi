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
    const tutee = await (
      await User.findOne({
        user: req.user.id,
      })
    ).populate("user", ["name", "email", "date"]);

    if (!tutee || req.user.type != "tutee") {
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
      about,
      languages,
      location,
      linkedin,
      twitter,
      facebook,
      instagram
    } = req.body;

    // Build tutee profile object
    const tuteeProfileFields = {};
    tuteeProfileFields.user = req.user.user.id;
    if (about) tuteeProfileFields.about = about;
    if (languages) {
      tuteeProfileFields.languages = languages
        .split(',')
        .map(languages => languages.trim());
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
// @desc    Create or update user's tutee profile
// @access  Private

// @route   DELETE api/tutees
router.delete("/:id", (req, res) => {
  Tutee.findById(req.params.id)
    .then((tutee) =>
      tutee.remove().then(() =>
        res.json({
          success: true,
        })
      )
    )
    .catch((err) =>
      res.status(404).json({
        success: false,
      })
    );
});

module.exports = router;
