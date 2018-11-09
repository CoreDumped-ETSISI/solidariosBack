'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eTypeSchema= new Schema({
    value: {type: String, text: true, required: true}
})