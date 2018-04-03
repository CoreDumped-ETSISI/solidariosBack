'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

var states = ['Tercera edad','Entorno penitenciario','Salud mental', 'Convivencia', 'Hospitales', 'Menores','Discapacidad'];

const NewsSchema = new Schema({
    role :{ type: String, enum: states },
    title : String,
    content : String,
    photo : String,
    date :  Date
});


module.exports = mongoose.model('News', NewsSchema)
