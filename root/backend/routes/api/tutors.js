const express = require('express');
const router = express.Router();
const io = require('../../socket');
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
const Rating = require('../../models/rating.model');
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
            .populate('appointments')
            .populate('ratings')

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


// @route    POST api/tutors/
// @desc     Create or update tutor profile
// @access   Private
router.post(
    '/',
    auth,
    [
        check('courses', 'Course cannot be empty').not().isEmpty(),
        check('languages', 'Languages cannot be empty').not().isEmpty()
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
            name
        } = req.body;

        const tutorProfileFields = {
            user: req.user.user.id,
            location,
            bio,
            social,
            languages: Array.isArray(languages) ? languages : languages.split(',').map((language) => language.trim()),
            courses: Array.isArray(courses) ? courses : courses.split(',').map((course) => course.trim())
        };

        try {

            query = {}
            query.profile = true
            if (name) {
                query.name = name;
            }
            //change user name and profile fields
            await User.findOneAndUpdate({
                _id: req.user.user.id
            }, query)

            // Using upsert option (creates new doc if no match is found):
            const tutor = await Tutor.findOneAndUpdate({
                user: req.user.user.id
            }, {
                $set: tutorProfileFields
            }, {
                new: true,
                upsert: true
            })
                .populate('user', ['name', 'email', 'type'])
                .populate('appointments')
                .populate('ratings');
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
            .populate('appointments', '-date', null, {
                sort: {
                    'start': -1
                }
            })
            .populate('ratings')
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
            .populate('appointments')
            .populate('ratings');

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
            return res.json({
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

    let s = Date.now();
    let {
        start,
        end,
        course,
        language,
        rating,
        name
    } = req.body;
    //let end = req.body.end;
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
        if (name) {
            const users = await User.find({
                name: {
                    $regex: name
                }
            }).select({
                _id: 1
            });
            const usersIDs = users.map((user) => user._id);
            query = {
                user: {
                    $in: usersIDs
                }
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
            $nin: [req.user.user.id]
        }

        query.blockedBy = {
            $nin: [req.user.user.id]
        }

        const tutors = await Tutor.find(query)
            .select('courses languages rating bio location profilePic coverPic')
            .populate('user', '-_id -password -type -date -__v -email -confirmed -profile');
        res.json(tutors);

        let e = Date.now();
        console.log('Query time: ', (e - s))
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/tutors/schedule
// @desc     Update available hours
// @access   Private
router.post('/schedule', auth, async (req, res) => {
    // findAndUpdate method doesn't return the updated hours even though they're saved in the database
    let {
        hours
    } = req.body;

    const availibility = hours.map((hour) => new Date(hour)).sort((x, y) => y - x)
    try {
        // update tutor's available hours
        const tutor = await Tutor.findOneAndUpdate({
            user: req.user.user.id
        }, {
            $set: {
                availableHours: availibility
            }
        }).populate('user', ['name', 'email', 'type']);

        if (!tutor) {
            return res.status(400).json({
                message: 'Tutor not found or there is no tutor profile for this user'
            })
        };

        tutor.availableHours = availibility

        io.getIo().emit(`availableHours-${tutor.id}`, availibility)
        res.json(tutor);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
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
        return res.status(400).json({
            message: 'Please provide an image file with 2MB max size'
        });
    }

    try {

        let tutor = await Tutor.findOne({
            user: req.user.user.id
        })

        if (fs.existsSync(`../frontend/src/images/uploads/${tutor.profilePic}`) && tutor.profilePic !== 'default-profile-pic.png') {
            fs.unlink(`../frontend/src/images/uploads/${tutor.profilePic}`, (err) => {
                if (err) throw err;
                console.log('Previous profile picture removed');
            });
        }

        await Tutor.findOneAndUpdate({
            user: req.user.user.id
        }, {
            profilePic: req.file.filename
        });

        tutor.profilePic = req.file.filename

        io.getIo().emit('profilePic', {
            tutor: tutor.id,
            profilePic: req.file.filename
        })
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

        let tutor = await Tutor.findOne({
            user: req.user.user.id
        })
        if (fs.existsSync(`../frontend/src/images/uploads/${tutor.coverPic}`) && tutor.coverPic !== 'default-cover-pic.png') {
            fs.unlink(`../frontend/src/images/uploads/${tutor.coverPic}`, (err) => {
                if (err) throw err;
                console.log('Previous cover picture removed');
            });
        }
        await Tutor.findOneAndUpdate({
            user: req.user.user.id
        }, {
            coverPic: req.file.filename
        });

        tutor.coverPic = req.file.filename

        io.getIo().emit('cover', {
            tutor: tutor.id,
            coverPic: req.file.filename
        })

        res.json(tutor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/addcover', async (req, res) => {
    try {
        const tutors = await Tutee.updateMany({
            coverPic: 'default-cover-pic.png'
        })
        res.json(tutors)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;