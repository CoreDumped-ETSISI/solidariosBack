'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

var states = ['Tercera edad','Entorno penitenciario','Salud mental', 'Convivencia', 'Hospitales', 'Menores','Discapacidad'];

const EventsSchema = new Schema({
    type : new Schema({ state: { type: String, enum: states }}),
    name : String,
    description : String,
    date : Date,
    location : String,
    capacity : Number,
    participants : [{type : ObjectId, ref: 'UserSchema'}],
    photo : String
});

module.exports = mongoose.model('Events', EventsSchema)
