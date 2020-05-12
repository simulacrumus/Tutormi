const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const tutorsRouter = require('./routes/api/tutors');
const tuteesRouter = require('./routes/api/tutees');

const app = express();

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/tutees', tuteesRouter);
//app.use('/api/tutors', tutorsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on PORT ${port}`));