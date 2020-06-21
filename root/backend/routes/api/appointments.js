const express = require('express');
const router = express.Router();
const config = require('config');
const io = require('../../socket');
const transporter = require('./../../config/email');
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

    try {

        const tutor1 = await Tutor.findOne({
            _id: tutorid
        }).populate({
            path: 'user',
            select: 'name email'
        });

        if (!tutor1) {
            return res.status(400).json({
                msg: "Tutor not found!"
            });
        }

        const tutee1 = await Tutee.findOne({
            _id: tuteeid
        }).populate({
            path: 'user',
            select: 'name email'
        });

        if (!tutee1) {
            return res.status(400).json({
                msg: "Tutee not found!"
            });
        }

        const hours = (start, end) => {
            let startTime = new Date(start);
            let endTime = new Date(end);
            let hours = new Array();
            while (startTime < endTime) {
                hours.push(new Date(startTime));
                startTime.setHours(startTime.getHours() + 1);
            }
            return hours;
        };

        const time = {
            start,
            end
        };


        const tutor = {
            id: tutorid,
            name: tutor1.user.name
        }

        const tutee = {
            id: tuteeid,
            name: tutee1.user.name
        }

        const newAppointment = {
            tutee,
            tutor,
            subject,
            time,
            note
        };

        let appointmentHours = new Array();
        appointmentHours = hours(start, end);

        const tutor2 = await Tutor.findOne({
            $and: [{
                    _id: tutorid
                },
                {
                    availableHours: {
                        $all: appointmentHours
                    }
                }
            ]
        });

        if (!tutor2) {
            return res.status(400).json({
                msg: "Tutor is unavailable during these hours"
            })
        }

        const appointment = Appointment(newAppointment);
        await appointment.save();

        if (!appointment._id) {
            return res.status(400).json({
                msg: "Appointment couldn't save!"
            });
        }

        await Tutor.findOneAndUpdate({
            _id: tutorid
        }, {
            $pull: {
                availableHours: {
                    $in: appointmentHours
                }
            },
            $addToSet: {
                appointments: appointment._id,
                $sort: {
                    start: -1
                }
            }
        })

        await Tutee.findOneAndUpdate({
            _id: tuteeid
        }, {
            $addToSet: {
                appointments: appointment._id,
                $sort: {
                    start: -1
                }
            }
        })

        const tutor3 = await Tutor.findById(tutorid)

        const htmloutput = `<p>You have a new appointment</p>
        <h3>Appointment Details:</h3>
        <ul>
            <li><strong>Date: </strong>${appointmentHours[0].getFullYear() + '-' + (appointmentHours[0].getMonth() + 1)+ '-' + appointmentHours[0].getDate()}</li>
            <li><strong>Time: </strong>${appointmentHours[0].getHours() + ':00 - ' + (appointmentHours[appointmentHours.length - 1].getHours() + 1) + ':00'}</li>
            <li><strong>Tutor: </strong>${tutor1.user.name}</li>
            <li><strong>Tutee: </strong>${tutee1.user.name}</li>
            <li><strong>Subject: </strong>${appointment.subject}</li>
            <li><strong>Notes: </strong>${appointment.note}</li>
            <li><strong>Date created: </strong>${appointment.date}</li>
        </ul>`;

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Tutormi" <info@tutormiproject.com>', // sender address
            to: `${tutor1.user.email}, ${tutee1.user.email}`, // list of receivers
            subject: "TUTORMI - NEW APPOINTMENT", // Subject line
            text: "", // plain text body
            html: htmloutput // html body
        });

        console.log("Message sent: %s", info.messageId);

        io.getIo().emit(`availableHours-${tutor.id}`, {
            availableHours: tutor3.availableHours
        })

        res.json(appointment);

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

// @route   DELETE api/appointments/:id
// @desc    Delete appointments by ID
// @access  Public
router.delete('/:id', auth, async (req, res) => {

    if (!req.params.id) {
        res.status(400).json({
            message: 'Appintment ID required to delete'
        });
    }

    // function to convert appointment hours to an array
    const hours = (appointment) => {
        let start = new Date(appointment.time.start);
        let end = new Date(appointment.time.end);
        let hours = new Array();
        while (start < end) {
            hours.push(new Date(start));
            start.setHours(start.getHours() + 1);
        }
        return hours;
    }

    try {
        // Find appointment
        const appointment = await Appointment.findById(req.params.id);

        // return arror message if appointment doesn't exist in db
        if (!appointment) {
            return res.status(400).json({
                message: 'No appointment found'
            });
        }

        //find tutor of the appointment
        const tutor = await Tutor.findById(appointment.tutor.id).populate({
            path: 'user',
            select: 'name email'
        });

        // return error message if tutor of the appointment doesn't exist
        if (!tutor) {
            return res.status(400).json({
                message: "Tutor of this appointment doesn't exist anymore"
            });
        }
        //find tutee of the appointment
        const tutee = await Tutee.findById(appointment.tutee.id).populate({
            path: 'user',
            select: 'name email'
        });

        // return error message if tutee of the appointment doesn't exist
        if (!tutee) {
            return res.status(400).json({
                message: "Tutee of this appointment doesn't exist anymore"
            });
        }

        // get user info for admin valication
        const user = await User.findById(req.user.user.id);

        // check if the user who intents to delete the appointment either tutee or tutor of the appointment or admin
        // if not, return an error message
        if (!(tutor.user.id === req.user.user.id || tutee.user.id === req.user.user.id || user.type === 'admin')) {
            return res.status(400).json({
                message: "Request denied! You don't have permisson to delete this appointment"
            });
        }

        const appointmentHours = hours(appointment);
        // add appointment hours to tutor's available hours and delete appointment id from appointments
        await Tutor.findOneAndUpdate({
            _id: appointment.tutor.id
        }, {
            $addToSet: {
                availableHours: appointmentHours,
                $sort: -1
            },
            $pull: {
                appointments: req.params.id
            }
        })

        //delete appointment id from appointments
        await Tutee.findOneAndUpdate({
            _id: appointment.tutee.id
        }, {
            $pull: {
                appointments: req.params.id
            }
        });

        // delete the appointment itself
        await Appointment.findOneAndDelete({
            _id: req.params.id
        });

        //notify tutor and tutee by email

        // create html 
        const htmloutput = `<p>Your appointment has been cancelled</p>
        <h3>Appointment Details:</h3>
        <ul>
            <li><strong>Date: </strong>${appointmentHours[0].getFullYear() + '-' + (appointmentHours[0].getMonth() + 1) + '-' + appointmentHours[0].getDate()}</li>
            <li><strong>Time: </strong>${appointmentHours[0].getHours() + ':00 - ' + (appointmentHours[appointmentHours.length - 1].getHours() + 1) + ':00'}</li>
            <li><strong>Tutor: </strong>${tutor.user.name}</li>
            <li><strong>Tutee: </strong>${tutee.user.name}</li>
            <li><strong>Subject: </strong>${appointment.subject}</li>
            <li><strong>Notes: </strong>${appointment.note}</li>
            <li><strong>Time of cancellation: </strong>${appointment.date}</li>
        </ul>`;

        const emailOptions = {
            from: '"Tutormi" <info@tutormiproject.com>', // sender address
            to: `${tutor.user.email}, ${tutee.user.email}`, // list of receivers
            subject: "TUTORMI - APPOINTMENT CANCELLED", // Subject line
            text: "", // plain text body
            html: htmloutput // html body
        }

        // send mail with defined transport object
        await transporter.sendMail(emailOptions, (err, info) => {
            if (error) {
                return res.status(400).json({
                    error: err
                });
            }
        });

        const tutor1 = await Tutor.findById(tutor.id);

        io.getIo().emit(`availableHours-${tutor.id}`, {
            availableHours: tutor1.availableHours
        })

        //return message
        res.json({
            message: `Appointment Cancelled. Confirmation email sent to ${tutor.user.email} and ${tutee.user.email}`,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


module.exports = router;