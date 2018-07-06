const passport = require('passport');
const FacebookStratery = require('passport-facebook').Strategy;
const User = require('../models/user');
const config = require('../config/secret');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});

passport.use(new FacebookStratery({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    profileFields: ['email', 'name', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback:true
}, (req, token, refreshToken, profile, done) => {
    User.findOne({facebook: profile.id}).then((user) => {
        if(user) return done(null, user);
        const newUser = new User();
        newUser.facebook = profile.id;
        newUser.email = profile._json.email;
        newUser.username = profile._json.first_name.replace(/\s/g, ''); // remove space;
        newUser.fullname = profile.displayName;
        newUser.photo = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        newUser.fbTokens.push({token});
        newUser.save((err) => {
            done(null, newUser);
        });
    }).catch((err) => done(err));
}));