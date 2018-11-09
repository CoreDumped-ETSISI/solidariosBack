'use strict';

const fs = require('fs');
const data = fs.readFileSync('./contacto.json', 'utf8');
const contactInfo = JSON.parse(data);

function getContactInfo(req, res) {
    return res.status(200).send({ contactInfo });
}

module.exports = {
    getContactInfo
};