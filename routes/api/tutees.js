const express = require('express');
const router = express.Router();

const Tutee = require('../../models/tutee.model');

router.get('/', (req, res) => {
    Tutee
        .find()
        .then((tutees) => {
            res.json(tutees)
        })
        .catch(err => res.status(400).json(err));
});

router.post('/', (req, res) => {
    const newTutee = new Tutee({
        name: req.body.name
    });
    newTutee
        .save()
        .then(tutee => {
            res.json(tutee)
        })
        .catch(err => res.status(400).json(err));
});


router.delete('/', (req, res) => {

});


module.exports = router;