'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

var states = ['Tercera edad','Entorno penitenciario','Salud mental', 'Convivencia', 'Hospitales', 'Menores','Discapacidad'];

const EventsSchema = new Schema({
    pig : { type: String, enum: states },
    name : String,
    description : String,
    date : Date,
    location : String,
    capacity : Number,
    participants : [{type : Schema.Types.ObjectId, ref: 'User'}],
    photo : String
});

module.exports = mongoose.model('Events', EventsSchema)
