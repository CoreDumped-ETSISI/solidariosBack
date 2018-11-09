'use strict';

const errors = {
    200: "Ok",
    201: "Created",
    400: "Bad request",
    401: "Unauthorised",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict",
    500: "Server exception"
}

function response(res, status, message, data) {
    message = message || (status in errors ? errors[status] : "Undefined msg");
    res.status(status).json({
        error: (status < 200 || status > 299),
        message: message,
        data: data,
        randomId: parseInt(Math.random() * 1000000000)
    });
}


module.exports = response;