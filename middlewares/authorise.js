'use strict';

const token = require('../services/token');
const User = require('../models/user');

function isAuthorised(req, res, next) {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }

    const tokenReq = req.headers.authorization.split(' ')[1];

    token.decode(tokenReq)
        .then(response => {
            User.findOne({_id: response})
                .exec((err, user) => {
                    if (err) {
                        return res.status(500).send({'message': 'Error while processing request'});
                    }
                    if (!user) return res.sendStatus(401);
                    //if (user.status !== 'Verified') return res.sendStatus(401);

                    req.user = response;
                    next();
                });
        })
        .catch(response => {
            return res.sendStatus(401);
        });
}

module.exports = isAuthorised;
