const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const imagesPath = require('../../../frontend/src/images/uploads/imagesPath')
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
        })
            .populate('user', ['name', 'email', 'date', 'type'])
            .populate('appointments');

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
        check('email', 'Email cannot be empty').isEmail()
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
            social,
            location,
            name,
            email
        } = req.body;

        const tutorProfileFields = {
            user: req.user.user.id,
            location,
            bio,
            name,
            email,
            social,
            languages: Array.isArray(languages) ? languages : languages.split(',').map((language) => language.trim()),
            courses: Array.isArray(courses) ? courses : courses.split(',').map((course) => course.trim())
        };

        try {
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
        const tutors = await Tutor.find()
            .populate('user', ['name', 'email', 'type'])
            .populate('appointments');;
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
        })
            .populate('user', ['name', 'email', 'type'])
            .populate('appointments');

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
router.post('/search', auth, async (req, res) => {
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
            while (startTime < endTime) {
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

        query.blockedUsers = {
            $nin: req.user.user.id
        }

        query.blockedBy = {
            $nin: req.user.user.id
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

// @route    PUT api/tutors/block/:id
// @desc     Block tutor using their user id
// @access   Private
router.put('/block/:id', auth, async (req, res) => {
    try {

        let tutor = await Tutor.findById(req.params.id);

        if (!tutor) {
            res.status(400).json({
                message: 'Tutor not found'
            })
        }

        await Tutor.findOneAndUpdate({
            _id: req.params.id
        }, {
            $addToSet: {
                blockedBy: req.user.user.id
            }
        });

        await Tutee.findOneAndUpdate({
            user: req.user.user.id
        }, {
            $addToSet: {
                blockedUsers: tutor.user.id
            }
        });

        tutor = await Tutor.findById(req.params.id);

        return res.json(tutor);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
});


// @route    PUT api/tutors/unblock.:id
// @desc     Unblock tutor using their user id
// @access   Private
router.put('/unblock/:id', auth, async (req, res) => {
    try {

        let tutor = await Tutor.findById(req.params.id);

        if (!tutor) {
            res.status(400).json({
                message: 'Tutor not found'
            })
        }

        await Tutor.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                blockedBy: req.user.user.id
            }
        });

        await Tutee.findOneAndUpdate({
            user: req.user.user.id
        }, {
            $pull: {
                blockedUsers: tutor.user.id
            }
        });

        tutor = await Tutor.findById(req.params.id);

        return res.json(tutor);
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
        destination: '../frontend/src/images/uploads/',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 2 // 2MB
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
            profilePic: `${req.file.filename}`
            // profilePic: `http://localhost:3000/public/uploads/tutors/${req.file.filename}`
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

// @route    POST api/tutors/cover-pic
// @desc     Upload or update cover picture of the tutor
// @access   Private
router.post('/cover-pic', auth, upload.single('image'), async (req, res) => {
    if (req.file == undefined) {
        res.status(400).json({
            message: 'Please provide an image file with 2MB max size'
        });
    }

    try {
        await Tutor.findOneAndUpdate({
            user: req.user.user.id
        }, {
            cover: req.file.filename
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