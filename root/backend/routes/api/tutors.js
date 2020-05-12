const express = require('express');
const router = express.Router();

let Tutor = require('../../models/tutor.model');

router.get('/tutor', (req, res) => {
    Tutor
        .find()
        .then(tutors => res.json(tutors))
        .catch(err => res.status(400).json(err));
});

module.exports = router;