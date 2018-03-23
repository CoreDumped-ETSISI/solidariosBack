'use strict'

const bodyParser  = require("body-parser")
const cors = require("cors")
const express = require("express")
const app = express()
const logger = require('./services/logger')



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

logger(app)

///routes

module.exports = app;
