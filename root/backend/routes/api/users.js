const express = require('express');
const router = express.Router();
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator/check');
const bcrypt = require('bcryptjs');


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
router.post('/', [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Please provide a valid email').isEmail(),
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
        about,
        userType
    } = req.body;

    try {

        // check if the user already ezists
        let tutee = await Tutee.findOne({
            email
        });

        if (tutee) {
            return res.status(400).json({
                errors: 'Username already exists'
            });
        }

        // create a new tutee object
        const user = new User({
            name,
            email,
            password,
            about,
            userType
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        // sae new tutee to database
        await user.save();

        newTutee
            .save()
            .then(tutee => {
                res.json(tutee)
            })
            .catch(err => res.status(400).json(err));




    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error!');
    }
});