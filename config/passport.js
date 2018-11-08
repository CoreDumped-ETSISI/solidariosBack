const passport = require("passport");
const JWTPassport = require("passport-jwt");
require("dotenv").config();
const User = require("../models/userModel");
const crypto = require('crypto');

const JWTStrategy = JWTPassport.Strategy;

let extractJWT = function(req) {
    let token = null;
    if (req && req.get('Authorization')) {
        token = req.get('Authorization');
    }
    return token;
};

const opts = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: extractJWT
}

passport.use(new JWTStrategy(opts, function(jwt, done) {
    if(!jwt.sub) return done(null, false);
    User.findById(decrypt(jwt.sub), (error, user) => {
        if(error) return done(null, false);
        done(null, user);
    })
}));

let isAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', function(err, user) {
        if(err) return res.send(err);
        if(!user) return res.status(401).json({error: true, message: "Invalid Authorization token"})
        next();
    })(req, res, next);
}
/*
function encrypt(text) {
    const cipher = crypto.createCipher(process.env.ALGORITHM, process.env.PASSWORD);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
*/
function decrypt(text) {
    const decipher = crypto.createDecipher(process.env.ALGORITHM, process.env.PASSWORD);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    passport,
    isAuthenticated
}
