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
        check('tutorId', 'Tutor ID is required').not().isEmpty(),
        check('rate', 'Rate value is required').not().isEmpty()
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
            rate,
            currentRatingId
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

            if (!tutee) {
                return res.status(400).json({
                    message: 'Tutee not found'
                })
            }

            const ratingFields = {
                tutor: {
                    id: tutor.id,
                    name: tutor.user.name
                },
                tutee: {
                    id: tutee.id,
                    name: tutee.user.name
                },
                rate
            }

            let currentRating;
            let rating;
            if (currentRatingId) {
                currentRating = await Rating.findByIdAndUpdate(currentRatingId, {
                    rate
                }).select('tutor.id -_id')
                rating = currentRating
            } else {
                newRating = Rating(ratingFields)
                await newRating.save()
                rating = newRating
            }

            let numOfRates = Array.from(tutor.ratings).length;
            let totalRate = 0;
            Array.from(tutor.ratings).forEach(rating => totalRate += rating.rate)

            if (!currentRating) {
                numOfRates++;
                totalRate += rate;
            } else {
                totalRate += (rate - currentRating.rate)
            }

            const ratingValue = isNaN(totalRate / numOfRates) ? rate : (totalRate / numOfRates) < 1 ? 1 : (totalRate / numOfRates)

            await Tutor.findOneAndUpdate({
                _id: tutor.id
            }, {
                $addToSet: {
                    ratings: rating.id
                },
                $set: {
                    rating: ratingValue
                }
            })

            await Tutee.findOneAndUpdate({
                _id: tutee.id
            }, {
                $addToSet: {
                    ratings: rating.id
                }
            })

            res.json({
                rating,
                average: ratingValue
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