const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
      // / User is passed in from Local Strategy - only runs when a user first authenticates
      // User's session has is hashed
      // User is attached to req.User
    done(null, user.id);
});

passport.deserializeUser((id , done) => {
    // takes the session hash and de-hashes it and checks if it's legit or not
     // Runs on every subsequent request
    User.findById(id, (err, user) => {
        done(err, user)
    });
});

// passport signup middleware
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: req.body.email}).then((user) => {
        if(user) return done(null, false, req.flash('error', 'Email Address is already taken'));
        User.findOne({username: req.body.username}).then((user) => {
           if (user) return done(null, false, req.flash('error', 'Username is already taken'));
           const newUser = new User();
           newUser.username = req.body.username.replace(/\s/g, '');
           newUser.email = req.body.email;
           newUser.fullname = req.body.fullname;
           newUser.password = req.body.password;
           newUser.save((err) => {
                return done(null, newUser);
           });
        }).catch(err => done(err));
    }).catch(err => done(err));
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email}).then((user) => {
        if(!user) return done(null, false, req.flash('error', 'User not found'));
        if (!user.comparePassword(password)) return done(null, false, req.flash('error', 'Oops wrong password'));
        return done(null, user)
    }).catch((err) => done(err));
}))