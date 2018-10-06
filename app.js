const express = require("express");
const bodyParser = require('body-parser');
const dotenv =  require("dotenv").config();
const passportConfig = require('./config/passport');
const jwt = require('jsonwebtoken');

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passportConfig.passport.initialize());

app.post("/upload/image", passportConfig.isAuthenticated, (req, res) => {
    res.send("1");
});

module.exports = app;
