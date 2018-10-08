'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const states = ['Tercera edad', 'Entorno penitenciario', 'Salud mental', 'Convivencia', 'Hospitales', 'Menores', 'Discapacidad'];

const EventsSchema = new Schema({
    role: {type: String, enum: states},
    name: {type: String, text: true},
    description: {type: String, text: true},
    photo: String,
    date: Date,
    location: {type: String, text: true},
    capacity: Number,
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Events', EventsSchema);