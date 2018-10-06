'use strict';

var fs=require('fs');
var data=fs.readFileSync('./contacto.json', 'utf8');
var contactInfo=JSON.parse(data);
const bodyParser = require('body-parser');

function getContactInfo(req, res) {
    return res.status(200).send({contactInfo});
}


module.exports = {
    getContactInfo
};