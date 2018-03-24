'use strict'

const bodyParser  = require("body-parser")
const cors = require("cors")
const express = require("express")
const app = express()
const logger = require('./services/logger')
const eventsRoutes = require('./routes/eventsRoutes')
const newsRoutes = require('./routes/newsRoutes')
const vRequestRoutes = require('./routes/vRequestRoutes')
//const                 //Def const es events

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

logger(app)

///routes
app.use('/event',eventsRoutes)
<<<<<<< HEAD
app.use('/user',userRoutes) 
=======
app.use('/news',newsRoutes)
app.use('/vRequest',vRequestRoutes)
>>>>>>> 6395aca9462e73413dc242dd90a476c55d128aee
//app.use('/')          //Def routes as events



module.exports = app;
