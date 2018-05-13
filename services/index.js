'use strict';

const crypto = require('crypto');
const config = require('../config.js');

function encrypt(text) {
    const cipher = crypto.createCipher(config.ALGORITHM, config.PASSWORD);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    const decipher = crypto.createDecipher(config.ALGORITHM, config.PASSWORD);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function normEmail(email) {
    return email.toLowerCase();
}

function isAdmin(user) {
    return user.admin === config.ADMIN_TOKEN
}

module.exports = {
    encrypt,
    decrypt,
    normEmail,
    isAdmin
};
