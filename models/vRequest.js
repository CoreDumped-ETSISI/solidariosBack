'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vRequestSchema = new Schema({
    rType: String,
    title: String,
    description: String,
    creationDate: Date,
    location: String,
    reqDate: Date,
    reqEnd: Date,
    status: Number,
    rating: Number
}, {versionKey: false});

module.exports = mongoose.model('vRequest', vRequestSchema);