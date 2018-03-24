'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config.js')
const services = require('../services')

function generate(user) {
  const payload = {
    sub: services.encrypt(String(user._id)),
    iat: moment.unix(),
    exp: moment().add(config.EXP_DAYS, 'days').unix()
  }
  return jwt.encode(payload, config.SECRET_TOKEN)
}

function decode(token) {
  const decoded = new Promise((resolve, reject) => {
    try{
      const payload = jwt.decode(token, config.SECRET_TOKEN)

      if(payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'Your authorization has expired'
        })
      }
      var userId = services.decrypt(payload.sub)
      resolve(userId)
    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid token'
      })
    }
  })
  return decoded
}

module.exports = {
  generate,
  decode
}
