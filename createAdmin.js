'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

const User = require('./models/user');

const userController = require('./controllers/userController');

mongoose.connect(config.MONGODB, {useMongoClient: true}, (err, res) => {
	if (err) {
		console.log('ERROR: connecting to Database. ' + err);
	} else {
		console.log("Connection to " + config.MONGODB + " was succesfull");
		makeAdmin();
	}
});


function makeAdmin(){
		const user = new User({
			name: "Admin",
			password: "7072396c3db2e3d51e8d9d22258brb81",
			email: "admin@coredumped.es",
			status: "Verified",
			admin: "wertyuioasefgjkl0i9xetu80ed5xd5xd350ik9d5",
			role: "admin"
		});
		user.save((err, user) => {
			if (err) {
				console.log(err);
				return res.status(500).send('Error while processing request');
			}
			if (!user) return console.log('Error saving the user');

			return console.log("User created");
		})
	}
