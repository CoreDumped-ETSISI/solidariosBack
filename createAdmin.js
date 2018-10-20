'use strict';

const mongoose = require('mongoose');

const User = require('./models/user');

mongoose.connect(process.env.MONGODB, {useMongoClient: true}, (err) => {
    if (err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connection to ' + process.env.MONGODB + ' was succesfull');
        makeAdmin();
    }
});


function makeAdmin() {
    const user = new User({
        name: 'Admin',
        password: process.env.ADMIN_PASS,
        email: 'admin@coredumped.es',
        status: 'Verified',
        admin: process.env.ADMIN_TOKEN,
        role: 'admin'
    });
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return console.log('Error while processing request');
        }
        if (!user) return console.log('Error saving the user');

        return console.log('User created');
    });
}
