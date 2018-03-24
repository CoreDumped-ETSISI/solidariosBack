'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const EventsSchema = new Schema({
    type : String,
    name : String,
    description : String,
    date : Date,
    location : String,
    capacity : Number,
    participants : [{type : ObjectId, ref: 'UserSchema'}],
    photo : String
});

module.exports = mongoose.model('Events', EventsSchema)
