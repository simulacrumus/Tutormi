const express = require('express');
const router = express.Router();
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('jwtSecret');
const transporter = require('./../../config/email');
const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');
const Tutor = require('../../models/tutor.model');
const Tutee = require('../../models/tutee.model');

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

        // create a new user object
        const newUser = new User({
            name,
            email,
            password,
            type
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);

        newUser.password = await bcrypt.hash(password, salt);

        // save new user to database
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
        res.status(500).send('Server error!');
    }
});

// @route   GET api/users/confirmation/:token
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
            return res.status(400).json({
                message: 'User not found!'
            });
        }

        res.status(200).send('Email confirmed. Please login');
    } catch (err) {
        res.status(401).json({
            msg: 'Token is not valid!'
        });
    }
});


// @route   POST api/users/forgetpswd
// @desc    Forget password route, takes email and sends a link to that email
// @access  Public
router.post('/forgetpswd', [
    check('email', 'Email cannot be empty').not().isEmpty(),
    check('email', 'Email address not valid').isEmail()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        email
    } = req.body;

    const user = await User.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "There's no user with this email"
        })
    }

    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: '1d'
    }, (err, token) => {
        if (err) throw err;

        // create html 
        const htmloutput = `<h3>Hi, ${user.name}!</h3>
        <p>Click <a href="<<FRONTEND LINK>>/${token}" target="_blank" >here</a> to reset your password!</p>`

        // send mail with defined transport object
        transporter.sendMail({
            from: '"Tutormi" <info@tutormiproject.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "TUTORMI - RESET PASSWORD", // Subject line
            text: "", // plain text body
            html: htmloutput, // html body
        });

        res.json({
            message: `Please check your email`
        })
    })
});

// @route   POST api/users/password
// @desc    Change password when user forgets password, takes a passwprd and token and changes the password for the logged in user
// @access  Private
router.post('/password', auth, [
    check('password', 'Password cannot be empty').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        password
    } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);

        const newPassword = await bcrypt.hash(password, salt);

        const user = await User.findOneAndUpdate({
            _id: req.user.user.id
        }, {
            password: newPassword
        })

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        res.json({
            message: 'Pasword updated'
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error!');
    }

});

// @route   POST api/users/changepassword
// @desc    Change password when user forgets password, takes a passwprd and token and changes the password for the logged in user
// @access  Private
router.post('/changepassword', auth, [
    check('currentPassword', 'Password cannot be empty').not().isEmpty(),
    check('newPassword', 'Password cannot be empty').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        currentPassword,
        newPassword
    } = req.body;

    try {
        const user = await User.findById(req.user.user.id)

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        console.log(user.password)

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                error: "Incorrect current password"
            })
        }

        const salt = await bcrypt.genSalt(10);

        const password = await bcrypt.hash(newPassword, salt);

        await user.update({
            password
        })

        res.json({
            message: 'Password updated'
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error!');
    }

});

// @route   POST api/users/changeemail
// @desc    Change email
// @access  Private
router.post('/changeemail', auth, [
    check('email', 'Invalid email address').isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        email,
        password
    } = req.body;

    try {
        const user = await User.findById(req.user.user.id)

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }

        await User.findOneAndUpdate({
            _id: req.user.user.id
        }, {
            email,
            confirmed: false
        })

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) throw err;

            // create html 
            const htmloutput = `<h3>Hi, ${user.name}! Welcome to Tutormi</h3>
                <p>Click <a href="http://localhost:5000/api/users/confirmation/${token}" target="_blank" >here</a> to confirm your email!</p>`

            // send mail with defined transport object
            transporter.sendMail({
                from: '"Tutormi" <info@tutormiproject.com>', // sender address
                to: `${email}`, // list of receivers
                subject: "TUTORMI - CONFIRM EMAIL", // Subject line
                text: "", // plain text body
                html: htmloutput, // html body
            });

            res.json({
                message: `Email updated, please check your inbox`
            })
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error!');
    }
});

// @route   POST api/users/resendconfirmation
// @desc    Resend confirmation email for user
// @access  Private
router.post('/resendconfirmation', auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.user.id)

        if (user.confirmed) {
            return res.status(400).json({
                message: 'Email already confirmed'
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) throw err;

            // create html 
            const htmloutput = `<h3>Hi, ${user.name}! Welcome to Tutormi</h3>
                <p>Click <a href="http://localhost:5000/api/users/confirmation/${token}" target="_blank" >here</a> to confirm your email!</p>`

            // send mail with defined transport object
            transporter.sendMail({
                from: '"Tutormi" <info@tutormiproject.com>', // sender address
                to: `${user.email}`, // list of receivers
                subject: "TUTORMI - CONFIRM EMAIL", // Subject line
                text: "", // plain text body
                html: htmloutput, // html body
            });

            res.json({
                message: `Confirmation email sent, please check your inbox`
            })
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error!');
    }
});

// @route    PUT api/users/block/:id
// @desc     Block user using their id (tutor or tutee id)
// @access   Private
router.put('/block/:id', auth, async (req, res) => {
    if (!id) {
        return res.status(400).json({
            message: "Please provide a valid id"
        })
    }
    try {

        const user = await User.findOne({
            _id: req.user.user.id
        })

        if (user.type === 'tutee') {
            const tutor = await Tutor.findById(id)

            if (!tutor) {
                return res.status(400).json({
                    message: "Tutor not found"
                })
            }

            const tutee = await Tutee.findOneAndUpdate({
                user: req.user.user.id
            }, {
                $addToSet: {
                    blockedUsers: tutor._id
                }
            })

            tutor.update({
                $addToSet: {
                    blockedBy: tutee._id
                }
            })

            return res.json({
                message: 'Tutor blocked'
            })
        } else if (user.type === 'tutor') {
            const tutee = await Tutee.findById(id)

            if (!tutee) {
                return res.status(400).json({
                    message: "Tutee not found"
                })
            }

            const tutor = await Tutor.findOneAndUpdate({
                user: req.user.user.id
            }, {
                $addToSet: {
                    blockedUsers: tutee._id
                }
            })

            tutee.update({
                $addToSet: {
                    blockedBy: tutor._id
                }
            })

            return res.json({
                message: 'Tutee blocked'
            })
        }

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
});


// @route    DELETE api/users/block/:id
// @desc     Unlock user using their id (tutor or tutee id)
// @access   Private
router.delete('/block/:id', auth, async (req, res) => {
    if (!id) {
        return res.status(400).json({
            message: "Please provide a valid id"
        })
    }
    try {

        const user = await User.findOne({
            _id: req.user.user.id
        })

        if (user.type === 'tutee') {

            const tutor = await Tutor.findById(id)

            if (!tutor) {
                return res.status(400).json({
                    message: "Tutor not found, you can pnly block tutors"
                })
            }

            const tutee = await Tutee.findOneAndUpdate({
                user: req.user.user.id
            }, {
                $pull: {
                    blockedUsers: tutor._id
                }
            })

            tutor.update({
                $pull: {
                    blockedBy: tutee._id
                }
            })

            return res.json({
                message: 'Tutor Unblocked'
            })
        } else if (user.type === 'tutor') {
            const tutee = await Tutee.findById(id)

            if (!tutee) {
                return res.status(400).json({
                    message: "Tutee not found, you can only block tutees"
                })
            }

            const tutor = await Tutor.findOneAndUpdate({
                user: req.user.user.id
            }, {
                $pull: {
                    blockedUsers: tutee._id
                }
            })

            tutee.update({
                $pull: {
                    blockedBy: tutor._id
                }
            })

            return res.json({
                message: 'Tutee Unblocked'
            })
        }

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
});

module.exports = router;