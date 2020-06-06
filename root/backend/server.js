const express = require('express');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const app = express();

// Connect to database
connectDB();

app.use(express.static('../frontend/public'));

const tutorsRouter = require('./routes/api/tutors');
const tuteesRouter = require('./routes/api/tutees');
const userRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const appointmentRouter = require('./routes/api/appointments');
const ratingsRouter = require('./routes/api/ratings');

app.use(express.json({
    extended: false
}));

app.use('/api/tutees', tuteesRouter);
app.use('/api/tutors', tutorsRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/ratings', ratingsRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on PORT ${port}`));