'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const logger = require('./services/logger');
const eventsRoutes = require('./routes/eventsRoutes');

const contactRoutes = require('./routes/contactRoutes');
const vRequestRoutes = require('./routes/vRequestRoutes');
const userRoutes = require('./routes/userRoutes');
const eTypeRoutes = require('./routes/eTypesRoutes');

const passportConfig = require('./config/passport');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passportConfig.passport.initialize());
app.use(cors());

logger(app);

// Routes
app.use('/event', eventsRoutes);
app.use('/contact', contactRoutes);
app.use('/user', userRoutes);
app.use('/vRequest', vRequestRoutes);
app.use('/eTypes', eTypeRoutes);


module.exports = app;
