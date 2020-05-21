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

        appointment = await appointment.save();

        if (!appointment) {
            return res.status(400).json({
                msg: "Appointment couldn't save!"
            });
        }

        tutor.appointments.unshift(appointment.id);

        tutor = await tutor.save();

        tutee.appointments.unshift(appointment.id);

        tutee = await tutee.save();

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
router.delete('/:id', auth, async ({
    params: {
        id
    }
}, res) => {

    if (!id) {
        res.status(400).json({
            message: 'Appintment ID required to delete'
        });
    }

    // function to convert appointment hours to an array
    const hours = (appointment) => {
        let start = new Date(appointment.time.start);
        let end = new Date(appointment.time.end);
        let hours = new Array();
        while (start <= end) {
            hours.push(new Date(start));
            start.setHours(start.getHours() + 1);
        }
        return hours;
    }

    try {
        // Find appointment
        const appointment = await Appointment.findById(id);

        // return arror message if appointment doesn't exist in db
        if (!appointment) {
            res.status(400).json({
                message: 'No appointment found'
            });
        }

        //find tutor of the appointment
        const tutor = await Tutor.findById(appointment.tutor);

        // return error message if tutor of the appointment doesn't exist
        if (!tutor) {
            res.status(400).json({
                message: "Tutor of this appointment doesn't exist anymore"
            });
        }
        //find tutee of the appointment
        const tutee = await Tutee.findById(appointment.tutee);

        // return error message if tutee of the appointment doesn't exist
        if (!tutee) {
            res.status(400).json({
                message: "Tutee of this appointment doesn't exist anymore"
            });
        }

        // get user info for admin valication
        const user = await User.findById(req.user.user.id);

        // check if the user who intents to delete the appointment either tutee or tutor of the appointment or admin
        // if not, return an error message
        if (!(tutor.user === req.user.user.id || tutee.user === req.user.user.id || user.type === 'admin')) {
            res.status(400).json({
                message: "Request denied! You don't have permisson to delete this appointment"
            });
        }

        // add appointment hours to tutor's available hours and delete appointment id from appointments
        await Tutor.findOneAndUpdate({
            _id: appointment.tutor
        }, {
            $addToSet: {
                availableHours: hours(appointment)
            },
            $pull: {
                appointments: id
            }
        });

        //delete appointment id from appointments
        await Tutee.findOneAndUpdate({
            _id: appointment.tutee
        }, {
            $pull: {
                appointments: id
            }
        });

        // delete the appointment itself
        await Appointment.findOneAndDelete({
            _id: id
        });

        //return message
        res.json({
            message: 'Appointment Deleted'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;