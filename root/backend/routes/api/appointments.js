const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('config');
const emailpassword = config.get('emailpassword');
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

// Nodemailer setup
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    name: "mail.maelitepainting.ca",
    host: "mail.maelitepainting.ca",
    port: 465,
    secure: true,
    auth: {
        user: 'test@maelitepainting.ca',
        pass: emailpassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

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
        }).populate('user', ['email', 'name']);

        if (!tutor) {
            return res.status(400).json({
                msg: "Tutor not found!"
            });
        }

        const tutee = await Tutee.findOne({
            _id: tuteeid
        }).populate('user', ['email', 'name']);

        if (!tutee) {
            return res.status(400).json({
                msg: "Tutee not found!"
            });
        }

        const hours = (start, end) => {
            let startTime = new Date(start);
            let endTime = new Date(end);
            let hours = new Array();
            while (startTime <= endTime) {
                hours.push(new Date(startTime));
                startTime.setHours(startTime.getHours() + 1);
            }
            return hours;
        };

        let appointmentHours = new Array();
        appointmentHours = hours(start, end);

        const tutor2 = await Tutor.find({
            availableHours: {
                $in: appointmentHours        
            },
                _id: tutorid
        });

        if(!tutor2) {
            return res.status(400).json({
                msg: "Tutor is unavailable during these hours"
            })
        } 
        
        const appointment = Appointment(newAppointment);
        appointment = await appointment.save();

        if (!appointment) {
            return res.status(400).json({
                msg: "Appointment couldn't save!"
            });
        }

        await Tutor.findOneAndUpdate({
            _id: tutorid
        }, {
            availableHours: {
                $pull: appointmentHours
            },
            appointments: {
                $addToSet: appointment.id
            }

        })

        await Tutee.findOneAndUpdate({
            _id: tuteeid
        }, {
            appointments: {
                $addToSet: appointment.id
            }
        })

        const htmloutput = `<p>You have a new appointment</p>
        <h3>Appointment Details:</h3>
        <ul>
            <li><strong>Date: </strong>${appointmentHours[0].getFullYear() + '-' + appointmentHours[0].getMonth() + '-' + appointmentHours[0].getDate()}</li>
            <li><strong>Time: </strong>${appointmentHours[0].getHours() + ':00 - ' + appointmentHours[appointmentHours.length - 1].getHours() + ':00'}</li>
            <li><strong>Tutor: </strong>${tutor.user.name}</li>
            <li><strong>Tutee: </strong>${tutee.user.name}</li>
            <li><strong>Subject: </strong>${appointment.subject}</li>
            <li><strong>Notes: </strong>${appointment.note}</li>
            <li><strong>Date created: </strong></li>
        </ul>`;

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Tutormi" <info@tutormiproject.com>', // sender address
            to: `${tutor.user.email}, ${tutee.user.email}`, // list of receivers
            subject: "TUTORMI - NEW APPOINTMENT", // Subject line
            text: "", // plain text body
            html: htmloutput, // html body
        });

        console.log("Message sent: %s", info.messageId);


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
        tutor = await Tutor.findOneAndUpdate({
            _id: appointment.tutor
        }, {
            $addToSet: {
                availableHours: hours(appointment)
            },
            $pull: {
                appointments: id
            }
        }).populate('user', ['email']);

        //delete appointment id from appointments
        tutee = await Tutee.findOneAndUpdate({
            _id: appointment.tutee
        }, {
            $pull: {
                appointments: id
            }
        }).populate('user', ['email']);

        // delete the appointment itself
        await Appointment.findOneAndDelete({
            _id: id
        });

        //notify tutor and tutee by email

        // create html 
        const htmloutput = `<p>Your appointment has been cancelled</p>
        <h3>Appointment Details:</h3>
        <ul>
            <li><strong>Date: </strong>${hours[0].getFullYear() + '-' + hours[0].getMonth() + '-' + hours[0].getDate()}</li>
            <li><strong>Time: </strong>${hours[0].getHours() + ':00 - ' + hours[hours.length - 1].getHours() + ':00'}</li>
            <li><strong>Tutor: </strong>${tutor.user.name}</li>
            <li><strong>Tutee: </strong>${tutee.user.name}</li>
            <li><strong>Subject: </strong>${appointment.subject}</li>
            <li><strong>Notes: </strong>${appointment.note}</li>
            <li><strong>Date created: </strong></li>
        </ul>`;


        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Tutormi" <info@tutormiproject.com>', // sender address
            to: `${tutor.user.email}, ${tutee.user.email}`, // list of receivers
            subject: "TUTORMI - APPOINTMENT CANCELLED", // Subject line
            text: "", // plain text body
            html: htmloutput, // html body
        });

        console.log("Message sent: %s", info.messageId);

        //return message
        res.json({
            message: `Appointment Deleted. Confirmation email sent to ${info.accepted}`,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


module.exports = router;