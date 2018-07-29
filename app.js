'use strict';

const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const logger = require('./services/logger');
const eventsRoutes = require('./routes/eventsRoutes');
const newsRoutes = require('./routes/newsRoutes');
const vRequestRoutes = require('./routes/vRequestRoutes');
const userRoutes = require('./routes/userRoutes');
//const                 //Def const es events

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

logger(app);

const publicDir = path.join(__dirname, 'public');
const imagesDirs = [
    path.join(publicDir, 'avatarImages'),
    path.join(publicDir, 'eventsImages'),
    path.join(publicDir, 'newsImages')
];

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}
imagesDirs.map((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

app.use(express.static(publicDir));

///routes
app.use('/event', eventsRoutes);
app.use('/user', userRoutes);
app.use('/news', newsRoutes);
app.use('/vRequest', vRequestRoutes);
//app.use('/')          //Def routes as events


module.exports = app;
