'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    displayName: { type: String, required: true },
    avatarImage: String,
    password: { type: String, select: false, required: true },
    signUpDate: { type:Date, default: Date.now() },
    lastLogin: Date,  //Unnecessary ????
    admin: { type: String, select: false },
    status: { type: String, enum: ['Created','Verified','Blocked','Deleted'] },
    verifyEmailToken: { type: String, select: false },
    verifyEmailExpires: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    balance: Number
}, { versionKey: false })

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