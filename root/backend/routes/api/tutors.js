const express = require('express');
const router = express.Router();
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
            user: req.user.id
        }).populate('user', ['name', 'email', 'date']);

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
    auth, [
        check('courses', '')
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
            linkedin,
            twitter,
            facebook,
            instagram,
            youtube,
            location
        } = req.body;

        const tutorProfileFields = {
            user: req.user.user.id,
            location,
            bio,
            languages: Array.isArray(languages) ?
                languages : languages.split(',').map((language) => language.trim())
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
            if (value && value.length > 0)
                social[key] = value;
        }
        tutorProfileFields.social = social;

        try {
            // Using upsert option (creates new doc if no match is found):
            let tutor = await Tutor.findOneAndUpdate({
                user: req.user.user.id
            }, {
                $set: tutorProfileFields
            }, {
                new: true,
                upsert: true
            });
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
        const profiles = await Tutor.find().populate('user', ['name', 'email']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/tutors/user/:id
// @desc     Get tutor by user ID
// @access   Public
router.get(
    '/user/:id',
    async ({
        params: {
            id
        }
    }, res) => {
        try {
            const profile = await Tutor.findOne({
                user: id
            }).populate('user', ['name', 'email']);

            if (!profile) return res.status(400).json({
                msg: 'Tutor not found'
            });

            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({
                msg: 'Server error'
            });
        }
    }
);

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

// @route    PUT api/tutors/appointment
// @desc     Add appointment
// @access   Private
router.put(
    '/appointment',
    [
        auth,
        [
            check('start', 'Start time is required').not().isEmpty(),
            check('end', 'End time is required').not().isEmpty(),
            check('subject', 'Subject is required').not().isEmpty(),
            check('tutoremail', 'Tutor\'s email is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            start,
            end,
            subject,
            tutoremail,
            note
        } = req.body;

        const time = {
            start,
            end
        };

        const newAppointment = {
            tutee: req.user.user.id,
            subject,
            time,
            note
        };

        try {

            const tutee = await Tutee.findOne({
                user: req.user.user.id
            });

            const tutorUser = await User.findOne({
                email: tutoremail
            });

            const tutor = await Tutor.findOne({
                user: tutorUser.id
            });

            newAppointment.tutor = tutor.user;

            const newAppointment = await Appointment.save(newAppointment);

            tutor.appintments.unshift(newAppointment.id);
            tutee.appintments.unshift(newAppointment.id);

            res.json([tutor, tutee]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;