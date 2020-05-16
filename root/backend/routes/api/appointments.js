const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    checkSchema,
    validationResult
} = require('express-validator');
const Tutor = require('../../models/tutor.model');
const Tutee = require('../../models/tutee.model');
const User = require('../../models/user.model');
const Appointment = require('../../models/appointment.model');

// @route   POST api/appointments
// @desc    Create an appointment
// @access  Private
router.post('/', [auth, [
    check('start', 'Start time is required').not().isEmpty(),
    check('end', 'End time is required').not().isEmpty(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('tutorid', 'Tutor ID is required').not().isEmpty(),
    check('tuteeid', 'Tutee ID is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        start,
        end,
        subject,
        tutorid,
        tuteeid,
        note
    } = req.body;

    const time = {
        start,
        end
    };

    const newAppointment = {
        tutee: tuteeid,
        tutor: tutorid,
        subject,
        time,
        note
    };

    try {

        const tutor = await Tutor.findOne({
            _id: tutorid
        });

        if (!tutor) {
            return res.status(400).json({
                msg: "Tutor not found!"
            });
        }

        const tutee = await Tutee.findOne({
            _id: tuteeid
        });

        if (!tutee) {
            return res.status(400).json({
                msg: "Tutee not found!"
            });
        }

        const appointment = Appointment(newAppointment);

        appointment.save();

        if (!appointment) {
            return res.status(400).json({
                msg: "Appointment couldn't save!"
            });
        }

        tutor.appointments.unshift(appointment.id);

        tutor.save();

        tutee.appointments.unshift(appointment.id);

        tutee.save();

        res.json([tutor, tutee]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/appontments/:id
// @desc    Get appointments by tutor id or tutee id
// @access  Public
router.get('/:id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const appointments = await Appointment.find({
            $or: [{
                    tutor: req.params.id
                },
                {
                    tutee: req.params.id
                }
            ]
        });

        if (appointments.length == 0) {
            return res.status(500).json({
                msg: "No appointment found for this user"
            });
        }

        res.json(appointments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


// @route   DELETE api/appintments/:id
// @desc    Delete appointments by ID
// @access  Public
router.delete('/:id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {

        // find tutor of the appointmnet
        const tutor = await Tutor.find({
            appointment: req.params.id
        });

        // get index of the appointment in tutor appointments
        const appintmentIndexTutor = tutor.appointments.map(item => item.appointment).indexOf(appointment.id);

        // remove appointment from tutor appointments
        tutor.appintments.splice(appintmentIndexTutor, 1);

        // save tutor back
        tutor = await tutor.save();

        // find tutee of the appoitnment
        const tutee = await Tutor.find({
            appointment: req.params.id
        });

        // get index of the ppointment in tutee appointments
        const appintmentIndexTutee = tutee.appointments.map(item => item.appointment).indexOf(appointment.id);

        // remove appointment from tutee appointments
        tutee.appintments.splice(appintmentIndexTutee, 1);

        // save tutee back
        tutee = await tutee.save();

        // delete the appointment
        const appointment = await Appointment.deleteOne({
            id: req.params.id
        });

        res.json(appointments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;