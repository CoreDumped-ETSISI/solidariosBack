'use strict';

const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/user');

mongoose.connect(config.MONGODB, {useMongoClient: true}, (err, res) => {
    if (err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log("Connection to " + config.MONGODB + " was succesfull");
        makeAdmin();
    }
});


function makeAdmin() {
    const user = new User({
        name: "Admin",
        password: config.ADMIN_PASS,
        email: "admin@coredumped.es",
        status: "Verified",
        admin: config.ADMIN_TOKEN,
        role: "admin"
    });
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return console.log('Error while processing request');
        }
        if (!user) return console.log('Error saving the user');

        return console.log("User created");
    })
}
