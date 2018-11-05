'use strict';

const crypto = require('crypto');

function encrypt(text) {
    const iv  = Buffer.from(process.env.ENC_IV, 'hex');
    const cipher = crypto.createCipheriv(process.env.ENC_ALGORITHM, process.env.ENC_KEY, iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    const iv  = Buffer.from(process.env.ENC_IV, 'hex');
    const decipher = crypto.createDecipheriv(process.env.ENC_ALGORITHM, process.env.ENC_KEY, iv);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function normEmail(email) {
    return email.toLowerCase();
}

function isAdmin(user) {
    return user.role === 'admin';
}

module.exports = {
    encrypt,
    decrypt,
    normEmail,
    isAdmin
};
