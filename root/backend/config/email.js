const nodemailer = require('nodemailer');
const config = require('config');
const emailpassword = config.get('emailpassword');
// Nodemailer setup
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
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

module.exports = transporter;