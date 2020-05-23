const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const auth = require('../../middleware/auth');
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator');
const Tutor = require('../../models/tutor.model');
const Tutee = require('../../models/tutee.model');
const User = require('../../models/user.model');
const Appointment = require('../../models/appointment.model');

// @route   GET api/tutors/me
// @desc    Get current tutor profile
// @access  Public
router.get('/me', auth, async (req, res) => {
    try {
        const tutor = await Tutor.findOne({
            user: req.user.user.id
        }).populate('user', ['name', 'email', 'date', 'type']);

        if (!tutor) {
            return res.status(400).json({
                msg: 'There is no tutor profile for this user'
            });
        }

        res.json(tutor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg: 'Server error!'
        });
    }
});

// @route    POST api/tutors
// @desc     Create or update tutor profile
// @access   Private
router.post(
    '/',
    auth,
    [
        check('courses', 'Course cannot be empty').not().isEmpty(),
        check('languages', 'Languages cannot be empty').not().isEmpty(),
        check('name', 'Name cannot be empty').not().isEmpty(),
        check('email', 'Email cannot be empty').not().isEmpty().isEmail()
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
            courses,
            languages,
            linkedin,
            twitter,
            facebook,
            instagram,
            youtube,
            location,
            name,
            email
        } = req.body;

        const tutorProfileFields = {
            user: req.user.user.id,
            location,
            bio,
            languages: Array.isArray(languages) ? languages : languages.split(',').map((language) => language.trim()),
            courses: Array.isArray(courses) ? courses : courses.split(',').map((course) => course.trim())
        };

        // Build social object and add to profileFields
        const social = {
            linkedin,
            twitter,
            facebook,
            instagram,
            youtube
        };

        for (const [key, value] of Object.entries(social)) {
            if (value && value.length > 0) social[key] = value;
        }
        tutorProfileFields.social = social;

        try {
            await User.findOneAndUpdate({
                _id: req.user.user.id
            }, {
                name: name,
                email: email
            });

            // Using upsert option (creates new doc if no match is found):
            let tutor = await Tutor.findOneAndUpdate({
                user: req.user.user.id
            }, {
                $set: tutorProfileFields
            }, {
                new: true,
                upsert: true
            }).populate('user', ['name', 'email', 'type']);
            res.json(tutor);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/tutors
// @desc     Get all tutors
// @access   Public
router.get('/', async (req, res) => {
    try {
        const tutors = await Tutor.find().populate('user', ['name', 'email', 'type']);
        res.json(tutors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/tutors/user/:id
// @desc     Get tutor by user ID
// @access   Public
router.get('/user/:id', async ({
    params: {
        id
    }
}, res) => {
    try {
        const tutor = await Tutor.findOne({
            _id: id
        }).populate('user', ['name', 'email', 'type']);

        if (!tutor)
            return res.status(400).json({
                msg: 'Tutor not found'
            });

        return res.json(tutor);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
});

// @route    DELETE api/tutors
// @desc     Delete tutor, user
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove tutor
        let tutor = await Tutor.findOneAndRemove({
            user: req.user.user.id
        });

        // Remove user
        let user = await User.findOneAndRemove({
            _id: req.user.user.id
        });

        if (!tutor || !user) {
            res.json({
                msg: 'Tutor not found'
            });
        }

        res.json({
            msg: 'Tutor deleted'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/tutors
// @desc     Get all tutors matching search criteria
// @access   Public
router.get('/search', auth, async (req, res) => {
    const {
        start,
        course,
        language,
        rating,
        key
    } = req.body;

    let end = req.body.end;
    let query = {};

    let appointmentHours = new Array();
    if (start) {
        end = end ? end : new Date(start).setHours(new Date(start).getHours() + 1);
        const hours = (start, end) => {
            let startTime = new Date(start);
            let endTime = new Date(end);
            let hours = new Array();
            while (startTime <= endTime) {
                hours.push(new Date(startTime));
                startTime.setHours(startTime.getHours() + 1);
            }
            return hours;
        };
        appointmentHours = hours(start, end);
    }

    try {
        if (key) {
            const users = await User.find({
                $or: [{
                        name: {
                            $regex: key
                        }
                    },
                    {
                        email: {
                            $regex: key
                        }
                    }
                ]
            }).select({
                _id: 1
            });
            const usersIDs = users.map((user) => user._id);
            query = {
                $or: [{
                        user: {
                            $in: usersIDs
                        }
                    },
                    {
                        bio: {
                            $regex: key
                        }
                    },
                    {
                        location: {
                            $regex: key
                        }
                    }
                ]
            };
        }

        if (language) {
            query.languages = {
                $in: [new RegExp(language, "g")]
            };
        }
        if (course) {
            query.courses = {
                $in: [new RegExp(course, "g")]
            };
        }

        if (rating) {
            query.rating = {
                $gte: rating
            };
        }

        if (start) {
            query.availableHours = {
                $all: appointmentHours
            };
        }

        const tutors = await Tutor.find(query)
            .select('courses languages rating bio location')
            .populate('user', '-_id -password -type -date -__v -email');

        res.json(tutors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/tutors/block.:id
// @desc     Block/Unblock tutee using their user id
// @access   Private
router.get('/block/:id', auth, async ({
    params: {
        id
    }
}, res) => {
    try {
        const tutee = await Tutee.findOne({
            id: id
        });

        if (!tutee)
            return res.status(400).json({
                msg: 'Tutee not found'
            });

        const tutor = await Tutor.findOne({
            user: req.user.user.id
        });

        if (tutee.blockedBy.includes(req.user.user.id)) {
            const index = tutee.blockedBy.indexOf(req.user.user.id);
            tutee.blockedBy.splice(index, 1);
        } else {
            tutee.blockedBy.unshift(req.user.user.id);
        }

        if (tutor.blocked.includes(tutee.user)) {
            const index = tutor.blocked.indexOf(tutee.user);
            tutor.blocked.splice(index, 1);
        } else {
            tutor.blocked.unshift(tutee.user);
        }

        tutee = await tutee.save();
        tutor = await tutor.save();

        return res.json(tutee);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
});

// @route    POST api/tutors/availibility
// @desc     Update available hours
// @access   Private
router.post('/schedule', auth, async (req, res) => {
    // findAndUpdate method doesn't return the updated hours even though they're saved in the database
    let {
        hours
    } = req.body;

    try {
        // update tutor's available hours
        await Tutor.findOneAndUpdate({
            user: req.user.user.id
        }, {
            $set: {
                availableHours: hours.map((hour) => new Date(hour))
            }
        });

        let tutor = await Tutor.findOne({
            user: req.user.user.id
        }).populate('user', ['name', 'email', 'type']);

        if (!tutor)
            return res.status(400).json({
                message: 'Tutor not found or there is no tutor profile for this user'
            });

        res.json(tutor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Multer function to upload image
const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads/tutors/',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 2000000
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Images Only! Only files with jpeg, jpg, png and gif extension accepted');
        }
    }
});

// @route    POST api/tutors/profile-pic
// @desc     Upload or update profile picture of the tutor
// @access   Private
router.post('/profile-pic', auth, upload.single('image'), async (req, res) => {
    if (req.file == undefined) {
        res.status(400).json({
            message: 'Please provide an image file with 2MB max size'
        });
    }

    try {
        await Tutor.findOneAndUpdate({
            user: req.user.user.id
        }, {
            profilePic: req.file.filename
        });

        const tutor = await Tutor.findOne({
            user: req.user.user.id
        });

        res.json(tutor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;