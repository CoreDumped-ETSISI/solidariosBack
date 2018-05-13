'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const states = ['admin', 'volunteer', 'needer'];
const statuses = ['Created', 'Verified', 'Blocked', 'Deleted'];

const UserSchema = new Schema({
    role: {type: String, enum: states},
    name: String,
    surname: String,
    PASSWORD: {type: String, select: false, required: true}, //changed pass by PASSWORD
    dni: String,
    email: String,
    phone: Number,
    address: String,
    age: Number,
    gender: String,
    description: String,
    avatarImage: String, //changed photo by avatarImage
    admin: {type: String, select: false}, //added admin
    status: {type: String, enum: statuses}, //changed verified by status
    verifyEmailToken: {type: String, select: false},
    verifyEmailExpires: {type: Date, select: false},
    resetPasswordToken: {type: String, select: false},
    resetPasswordExpires: {type: Date, select: false}
}, {versionKey: false});

UserSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('PASSWORD')) return next();
    bcrypt.genSalt(8, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.PASSWORD, salt, null, (err, hash) => {
            if (err) return next(err);
            user.PASSWORD = hash;
            next()
        })
    })
});

module.exports = mongoose.model('User', UserSchema);
