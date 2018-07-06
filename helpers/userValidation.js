module.exports = function(){
    return {
        SignUpValidation(req, res, next){
            // usernamae validation
            req.checkBody('username', 'username is required').notEmpty();
            req.checkBody('username', 'username is must be less than 5').isLength({min: 5});
            // email validation
            req.checkBody('email', 'email is required').notEmpty();
            req.checkBody('email', 'email is invalid').isEmail();
            // password validation
            req.checkBody('password', 'password is required').notEmpty();
            req.checkBody('password', 'password is must be less than 5').isLength({min: 5});

            req.getValidationResult().then((result) => {
                const errors = result.array();
                const messages = [];
                errors.forEach(error => {
                    messages.push(error.msg);
                });

                req.flash('error', messages);
                res.redirect('/signup');
                
            }).catch((err) => {
                
            });
        }
    }
}