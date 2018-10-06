const passport = require("passport");
const JWTPassport = require("passport-jwt");
const dotenv =  require("dotenv").config();
const User = require("../models/userModel");

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
    User.findById(services.decrypt(jwt.sub), (error, user) => {
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

module.exports = {
    passport,
    isAuthenticated
}
