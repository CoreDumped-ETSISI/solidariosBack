'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const states = ['admin', 'volunteer', 'needer'];
const statuses = ['Created', 'Verified', 'Blocked', 'Deleted'];

const UserSchema = new Schema({
    role: {type: String, enum: states, required: true},
    name: {type: String, required: true, minLength: 3, maxLength: 50},
    surname: {type: String, required: true, minLength: 3, maxLength: 50},
    password: {type: String, select: false, required: true},
    dni: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    phone: {type: Number, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true, min: 18},
    gender: {type: String, required: true},
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
    bcrypt.genSalt(8, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);
