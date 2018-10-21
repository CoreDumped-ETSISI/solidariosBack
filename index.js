'use strict';

require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;


mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (!err) {
        console.log('Connection to ' + process.env.MONGODB + ' was succesfull');
        app.listen(port, () => {
            console.log('Node server running on http://localhost:' + port);
        });
    } else {
        console.error('ERROR: connecting to Database. ' + err);
        process.exit(1);
    }
});


