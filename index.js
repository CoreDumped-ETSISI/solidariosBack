'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose.Promise = global.Promise;

mongoose.connect(config.MONGODB, {useMongoClient: true}, (err, res) => {
    if (err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log("Connection to " + config.MONGODB + " was succesfull");
        app.listen(config.PORT, () => {
            console.log("Node server running on http://localhost:" + config.PORT);
        });
    }
});
