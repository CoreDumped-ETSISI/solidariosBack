'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema

var states = ['admin','volunteer','needer'];

const UserSchema = new Schema({
    role : { type: String, enum: states },
    name : String,
    surname : String,
    pass : String,
    dni : String,
    email : String,
    phone : Number,
    address : String,
    age : Number,
    gender : String,
    description : String,
    photo : String,
    verified : Boolean
});


module.exports = mongoose.model('User', UserSchema)