'use strict';

function isNeeder(req, res, next) {
    if (req.role === "needer") next();
    else res.sendStatus(401);
}

module.exports = isNeeder;
