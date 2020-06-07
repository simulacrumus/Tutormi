const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Rating = require('../../models/rating.model');
const Tutor = require('../../models/tutor.model');
const Tutee = require('../../models/tutee.model');
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator');

// @route   GET api/ratings
// @desc    Get all ratings
// @access  Public
router.get('/', async (req, res) => {
    try {
        const ratings = await Rating.find()
        res.json(ratings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    POST api/ratings
// @desc     Create a rating
// @access   Private
router.post(
    '/', auth,
    [
        check('tutorId', 'Tutor ID is required').isEmail(),
        check('rate', 'Rate value is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            tutorId,
            rate
        } = req.body

        if (rate < 1 || rate > 5) {
            return res.status(400).json({
                message: 'Rate should be between 1 and 5'
            })
        }

        try {

            const tutor = await Tutor.findById(tutorId)
                .populate('user', 'name')
                .populate('ratings')

            if (!tutor) {
                return res.status(400).json({
                    message: 'Tutor not found'
                })
            }

            const tutee = await Tutee.findOne({
                user: req.user.user.id
            }).populate('user', 'name')

            const currentRating = await Rating.findOneAndUpdate({
                tutor: {
                    id: tutor.id
                },
                tutee: {
                    id: tutee.id
                }
            }, {
                rate: rate
            })

            let numOfRates = Array.from(tutor.ratings).length;
            let totalRate = 0;
            Array.from(tutor.ratings).forEach(rating => totalRate += rating.rate)

            if (!currentRating) {
                const newRating = {
                    tutor: {
                        id: tutor.id,
                        name: tutor.user.name
                    },
                    tutee: {
                        id: tutee.id,
                        name: tutee.user.name
                    },
                    rate: rate
                }

                const rating = Rating(newRating)
                await rating.save()

                numOfRates++;
                totalRate += rate;

                await Tutor.findOneAndUpdate({
                    _id: tutor.id
                }, {
                    $addToSet: {
                        ratings: rating.id
                    },
                    $set: {
                        rating: (totalRate / numOfRates)
                    }
                })

                await Tutee.findOneAndUpdate({
                    _id: tutee.id
                }, {
                    $addToSet: {
                        ratings: rating.id
                    }
                })
            } else {
                totalRate += (rate - currentRating.rate)
                await Tutor.findOneAndUpdate({
                    _id: tutor.id
                }, {
                    $set: {
                        rating: (totalRate / numOfRates)
                    }
                })
            }

            res.json({
                message: "Tutor rated!"
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

// @route    DELETE api/ratings
// @desc     Remove a rate
// @access   Private
router.delete('/:id', auth, async (req, res) => {

    if (!req.params.id) {
        return res.status(400).json({
            message: 'Rating ID cannot be empty'
        })
    }

    try {

        const rating = await Rating.findOneAndDelete({
            _id: req.params.id
        })

        if (!rating) {
            return res.status(400).json({
                message: 'Rating not found'
            })
        }

        await Tutee.findOneAndUpdate({
            _id: rating.tutee.id
        }, {
            $pull: {
                ratings: rating.id
            }
        })

        const tutor = await Tutor.findOne({
            _id: rating.tutor.id
        })

        let numOfRates = Array.from(tutor.ratings).length - 1;
        let totalRate = 0;
        Array.from(tutor.ratings).forEach(rating => totalRate += rating.rate)
        totalRate - rating.rate

        await Tutor.findOneAndUpdate({
            _id: tutor.id
        }, {
            $pull: {
                ratings: rating.id
            },
            $set: {
                rating: (totalRate / numOfRates)
            }
        })

        res.json({
            message: 'Rating deleted'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;