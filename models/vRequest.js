'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const vRequestSchema = new Schema({
    Type : String,
    Title : String,
    description : String,
    creationDate : Date,
    location : String,
    reqDate : Date,
    reqTime : Number
});

module.exports = mongoose.model('vRequest', vRequestSchema)