const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const tutorsRouter = require('./routes/api/tutors');
const tuteesRouter = require('./routes/api/tutees');
const userRouter = require('./routes/api/users');

app.use(express.json({
    extended: false
}));

app.use('/api/tutees', tuteesRouter);
app.use('/api/tutors', tutorsRouter);
app.use('/api/users', userRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on PORT ${port}`));