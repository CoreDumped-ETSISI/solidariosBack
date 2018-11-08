'use strict';

function isAdmin(req, res, next) {
    if (req.role === "admin") next();
    else res.sendStatus(401);
}

module.exports = isAdmin;
