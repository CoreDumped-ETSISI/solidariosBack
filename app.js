'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const logger = require('./services/logger');
const mongoose = require('mongoose');
const eventsRoutes = require('./routes/eventsRoutes');

const contactRoutes = require('./routes/contactRoutes');
const vRequestRoutes = require('./routes/vRequestRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (!err) {
        console.log('Connection to ' + process.env.MONGODB + ' was succesfull');
    } else {
        console.error('ERROR: connecting to Database. ' + err);
        process.exit(1);
    }
});

logger(app);

// Routes
app.use('/event', eventsRoutes);
app.use('/contact', contactRoutes);
app.use('/user', userRoutes);
app.use('/vRequest', vRequestRoutes);


module.exports = app;
