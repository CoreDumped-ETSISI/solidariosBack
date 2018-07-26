'use strict';

let Chat = require('../models/chat');
let User = require('../models/user');

let ioSockets = require('socket.io');
let io;

function getHistory(chat_id) {
    Chat.findById(chat_id, (err, chat) => {
        return chat.messages;
    })
}

function addMessage(chat_id, user, msg) {
    if (!msg || msg.length < 1) {
        return;
    }
    Chat.findById(chat_id, (err, chat) => {
        chat.messages.push({
            text: msg,
            user: user
        });
        chat.save((err, savedChat) => {
            if (!err) {
                Chat.findById(chat_id)
                    .populate({path: 'messages.user', select: 'name -_id'})
                    .exec((err, chatPopulated) => {
                        if (!err) {
                            let msg = chatPopulated.messages[chatPopulated.messages.length - 1];
                            io.to(chat_id).emit('chat_message', msg);
                        }
                    });
            }
        });
    });
}

module.exports = {
    init: function (server) {
        io = ioSockets(server);

        let auth_clients = [];

        io.on('connection', function (client) {
            console.log('User with ID:' + client.id + ' connected');

            client.on('authenticate', (data) => {
                let token = data.token;
                let chat_id = data.chat_id;
                let lastMsgTimestamp = data.lastMsgTimestamp;
                console.log(client.id + ' authenticating with token: ' + token + ' and joining to room: ' + chat_id);

                let decodedToken = token; //TODO

                Chat.findOne({
                    $and: [
                        {_id: chat_id},
                        {$or: [{userA: decodedToken}, {userB: decodedToken}]}
                    ]
                }, {messages: {$slice: -100}})
                    .populate({path: 'messages.user', select: 'name -_id'})
                    .exec((err, chat) => {
                        if (err) {
                            console.log('Igotin');

                            console.log(err);
                            return io.to(client.id).emit('chat_message', 'Error processing the authentication.(500)');
                        }
                        console.log('Igotin2');

                        if (!chat) return io.to(client.id).emit('chat_message', {
                            timestamp: Date.now(),
                            text: 'Error processing the authentication.(404)',
                            user: {name: 'SysAdmin'}
                        });

                        console.log('Authenticated!!!');

                        client.join(chat_id);
                        auth_clients.push({
                            id: client.id,
                            chat_id: chat_id,
                            user_id: token
                        });

                        if (chat && chat.messages) {
                            let history = chat.messages;
                            if (history && history.length > 0) {
                                /*if(lastMsgTimestamp){
                                    history = history.filter((msg) => {
                                        return msg.timestamp > new Date(lastMsgTimestamp - 9200000);
                                    });
                                }*/
                                history.forEach((msg) => {
                                    io.to(client.id).emit('chat_message', msg);
                                });
                            }
                        }
                    });
            });

            client.on('chat_message', (data) => {
                let auth_client = auth_clients.filter((elem) => {
                    return client.id === elem.id
                })[0];
                if (auth_client) {
                    addMessage(auth_client.chat_id, auth_client.user_id, data.msg);
                }
            });

            client.on('disconnect', () => {
                console.log('User ' + client.id + ' disconnected');
                auth_clients = auth_clients.filter((elem) => {
                    return client.id !== elem.id
                });
            })
        });
    },
    createRoom: function (req, res) {
        let userA = req.body.userA;
        let userB = req.body.userB;

        User.findById(userA, (err, user) => {
            if(err) return res.status(500).send({message: 'A error occurred creating the chat.(500)'});
            if(!user) return res.status(500).send({message: 'A error occurred creating the chat.(404)'});
            User.findById(userB, (err, user) => {
                if(err) return res.status(500).send({message: 'A error occurred creating the chat.(500)'});
                if(!user) return res.status(500).send({message: 'A error occurred creating the chat.(404)'});
                let chat = new Chat({
                    userA: userA,
                    userB: userB
                });
                chat.save((err, savedChat) => {
                    if (err) return res.status(500).send({message: 'A error occurred creating the chat.'});
                    return res.status(201).send(savedChat);
                });
            });
        });


    },
    addMessage,
    getHistory
};