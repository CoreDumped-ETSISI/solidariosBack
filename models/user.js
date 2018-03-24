'use strict'

const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

var states = ['admin','volunteer','needer'];
var statuses = ['Created','Verified','Blocked','Deleted'];

const UserSchema = new Schema({
    role : { type: String, enum: states },
    name : String,
    surname : String,
    password: { type: String, select: false, required: true }, //changed pass by password
    dni : String,
    email : String,
    phone : Number,
    address : String,
    age : Number,
    gender : String,
    description : String,
    avatarImage : String, //changed photo by avatarImage
    status: { type: String, enum: statuses }, //changed verified by status
    verifyEmailToken: { type: String, select: false },
    verifyEmailExpires: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false }
}, { versionKey: false });

UserSchema.pre('save', function(next) {
  let user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(8, (err, salt) => {
    if(err) return next(err)
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) return next(err)
      user.password = hash
      next()
    })
  })
})

module.exports = mongoose.model('User', UserSchema)