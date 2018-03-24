'use strict'

const token = require('../services/token.js')
const User = require('../models/user.js')

function isAuthorised(req, res, next) {
  if (!req.headers.authorization) {
    return res.sendStatus(401)
  }

  const tokenReq = req.headers.authorization.split(" ")[1]

  token.decode(tokenReq)
    .then(response => {
      User.findOne({_id: response})
      .exec((err, user) => {
        if (err) return res.sendStatus(500)
        if (!user) return res.sendStatus(401)
        if(user.status != 'Verified') return res.sendStatus(401)
        
        req.user = response
        next()
      })
    })
    .catch(response => {
      return res.sendStatus(401)
    })
}

module.exports = isAuthorised
