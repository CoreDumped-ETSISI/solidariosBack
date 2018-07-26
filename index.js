'use strict';

const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const config = require('./config');

const server = http.Server(app);

let chat = require('./controllers/chatController');

mongoose.connect(config.MONGODB, {useNewUrlParser: true}, (err, res) => {
    if (err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log("Connection to " + config.MONGODB + " was succesfull");
        chat.init(server);
        server.listen(config.PORT, () => {
            console.log("Node server running on http://localhost:" + config.PORT);
        });
    }
});
