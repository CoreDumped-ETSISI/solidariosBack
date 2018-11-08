'use strict';

function isVolunteer(req, res, next) {
    if (req.role === "volunteer") next();
    else res.sendStatus(401);
}

module.exports = isVolunteer;
