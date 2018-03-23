'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const NewsSchema = new Schema({
    type : String,
    title : String, 
    description : String,
    photo : String
});


module.exports = mongoose.model('News', NewsSchema)