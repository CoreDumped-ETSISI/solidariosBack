'use strict'

var mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

mongoose.connect(config.MONGODB, (err, res) => {
  if (err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log("Connection to " + config.MONGODB + " was succesfull")
    app.listen(config.PORT, () => {
      console.log("Node server running on http://localhost:" + config.PORT);
    });
  }
});
