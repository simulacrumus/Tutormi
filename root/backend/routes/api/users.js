const express = require('express');
const router = express.Router();
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');

var Schema = {
    "type": {
        in: 'body',
        matches: {
            options: [/\b(?:tutor|tutee)\b/],
            errorMessage: 'User type should be either tutor or tutee'
        }
    }
}

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Please provide a valid email address').isEmail(),
    check('password', 'Password should be at least 8 characters').isLength({
        min: 8,
        max: 25
    }),
    checkSchema(Schema)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        name,
        email,
        password,
        type
    } = req.body;

    try {
        // check if the user already ezists
        let user = await User.findOne({
            email
        });

        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: 'Username already exists'
                }]
            });
        }

        // create a new tutee object
        const newUser = new User({
            name,
            email,
            password,
            type
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);

        newUser.password = await bcrypt.hash(password, salt);

        // sae new tutee to database
        await newUser.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 18000
        }, (err, token) => {
            if (err) throw err;
            res.json({
                token
            });
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error!');
    }
});

module.exports = router;