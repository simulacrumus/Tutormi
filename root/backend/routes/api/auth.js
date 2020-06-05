const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator');

// @route   GET api/auth
// @desc    Authentication route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('*auth*Server error');
    }
});

// @route    POST api/auth
// @desc     Authenticate user and get token
// @access   Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email,
            password,
            type
        } = req.body;

        try {
            let user = await User.findOne({
                email
            });

            if (!user) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            message: 'Invalid Credentials'
                        }]
                    });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            message: 'Invalid Credentials'
                        }]
                    });
            }

            if (type !== user.type) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            message: `Please login as ${user.type}`
                        }]
                    });
            }

            if (!user.confirmed) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            message: 'Please confirm your email first'
                        }]
                    });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                    expiresIn: '1d'
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        hasProfile: user.profile
                    });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;