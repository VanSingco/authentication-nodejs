

module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        if (req.user) {
           return res.render('main/index');
        } else {
            return res.render('landing');
        }
    });
    // login
    app.route('/login')
        .get((req, res) => {
            if (req.user) return res.redirect('/');
            const message = req.flash('error');
            const hasError = message.length > 0;
            res.render('account/login', {message, hasError});
        })
        .post(passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));
    // signup
    app.route('/signup')
        .get((req, res) => {
            if (req.user) return res.redirect('/');
            const errors = req.flash('error');
            const hasError = errors.length > 0;
            res.render('account/signup', {messages:errors, hasError});
        })
        .post(passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }));
     // logout
     app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    // facebook authentication
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signup',
        failureFlash: true
    }), (req, res) => {
        if (req.user) {
             return res.redirect('/');
        } else {
             return res.render('landing');
        }
    });
      // google authentication
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
    }));
    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signup',
        failureFlash: true
    }), (req, res) => {
         if (req.user) {
             return res.redirect('/');
         } else {
              return res.render('landing');
         }
    });
}