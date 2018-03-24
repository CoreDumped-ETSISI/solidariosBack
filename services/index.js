'use strict'

const jwt = require('jwt-simple')
const crypto = require('crypto')
const moment = require('moment')
const config = require('../config.js')
const User = require('../models/user.js')

function encrypt(text){
  var cipher = crypto.createCipher(config.algorithm, config.password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(config.algorithm, config.password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


function calcPrice(marketPrice){
  var price = (marketPrice * config.profit)*100
  return (price + ((5 - (price % 5)) % 5))/100;
}

function normEmail(email) {
    return email.toLowerCase();
}

function isAdmin(user) {
    return user.admin == config.ADMIN_TOKEN
}

function countOccurrences(obj, list){
  var count = 0
  for(var i = 0; i < list.length; i++){
    if(obj == list[i])
    count++
  }
  return count
}

module.exports = {
  encrypt,
  decrypt,
  calcPrice,
  normEmail,
  isAdmin,
  countOccurrences
}
