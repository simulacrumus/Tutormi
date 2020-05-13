const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');
const bcrypt = require('bcryptjs');

const Tutee = require('../../models/tutee.model');

// @route   GET api/tutees
router.get('/', (req, res) => {
    Tutee
        .find()
        .then((tutees) => {
            res.json(tutees)
        })
        .catch(err => res.status(400).json(err));
});

// @route   DELETE api/tutees
router.delete('/:id', (req, res) => {
    Tutee.findById(req.params.id)
        .then(tutee => tutee.remove().then(() => res.json({
            success: true
        })))
        .catch(err => res.status(404).json({
            success: false
        }));
});

module.exports = router;