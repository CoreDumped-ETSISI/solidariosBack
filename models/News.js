'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

var states = ['Tercera edad','Entorno penitenciario','Salud mental', 'Convivencia', 'Hospitales', 'Menores','Discapacidad'];

const NewsSchema = new Schema({
    type : new Schema({ state: { type: String, enum: states }}),
    title : String,
    description : String,
    photo : String
});


module.exports = mongoose.model('News', NewsSchema)
