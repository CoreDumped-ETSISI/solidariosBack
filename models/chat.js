'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    creationTimestamp: {type: Date, default: Date.now},
    messages: [{
        timestamp: {type: Date, default: Date.now},
        text: String,
        user: {type: Schema.Types.ObjectId, ref: 'User'}
    }],
    userA: {type: Schema.Types.ObjectId, ref: 'User'},
    userB: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Chat', ChatSchema);