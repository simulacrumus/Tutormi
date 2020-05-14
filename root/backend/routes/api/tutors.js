const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Tutor = require('../../models/tutor.model');
const User = require('../../models/user.model');

// @route   GET api/tutors/me
// @desc    Get current tutor profile
// @access  Public
router.get('/me', auth, async (req, res) => {
    try {
        const tutor = await (await Tutor.findOne({
            user: req.user.id
        })).populate('user', ['name', 'email', 'date']);

        if (!tutor || tutor.user.type != 'tutor') {
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

module.exports = router;