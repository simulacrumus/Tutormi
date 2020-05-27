const express = require('express');
const router = express.Router();
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('jwtSecret');
const transporter = require('./../../config/email');
const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');

var Schema = {
    "type": {
        in: 'body',
        matches: {
            options: [/\b(?:tutor|tutee|admin)\b/],
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
        // check if the user already exists
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

        // save new tutee to database
        await newUser.save();

        const payload = {
            user: {
                id: newUser.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) throw err;

            // create html 
            const htmloutput = `<h3>Hi, ${name}! Welcome to Tutormi</h3>
            <p>Click <a href="http://localhost:5000/api/users/confirmation/${token}" target="_blank" >here</a> to confirm your email!</p>`

            // send mail with defined transport object
            transporter.sendMail({
                from: '"Tutormi" <info@tutormiproject.com>', // sender address
                to: `${email}`, // list of receivers
                subject: "TUTORMI - WELCOME TO TUTORMI", // Subject line
                text: "", // plain text body
                html: htmloutput, // html body
            });

            res.json({
                message: `User saved. Confirmation email sent to ${email}`
            })
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('*users* Server error!');
    }
});

// @route   PUT api/users/confirmation/:token
// @desc    Confirm user email
// @access  Public
router.get('/confirmation/:token', async ({
    params: {
        token
    }
}, res) => {
    try {
        const decoded = jwt.verify(token, secret);

        const user = await User.findByIdAndUpdate({
            _id: decoded.user.id
        }, {
            confirmed: true
        });

        if (!user) {
            res.status(400).json({
                message: 'User not found!'
            });
        }

        res.status(200).send('Email confirmed. Please login.');
    } catch (err) {
        res.status(401).json({
            msg: 'Token is not valid!'
        });
    }
});


module.exports = router;