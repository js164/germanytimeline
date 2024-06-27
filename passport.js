const LocalStrategy=require('passport-local').Strategy;
const { compareSync } = require('bcrypt');
const passport = require('passport');
const dotenv=require('dotenv').config({path: __dirname + '/.env' })
const timelineUser=require('./models/Auth/user')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTtoken;
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try{
        const user = await timelineUser.findOne({_id: jwt_payload._id})
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }catch{
        return done(err, false);
    }
}));

module.exports = function (passport) {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            timelineUser.findOne({ username: username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (!compareSync(password,user.password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })
    passport.deserializeUser(function(id, done) {
        timelineUser.findById(id, function(err, user) {
          done(err, user);
        });
    });

}