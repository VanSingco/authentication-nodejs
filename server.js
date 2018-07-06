const express = require('express');
const bodyParser = require('body-parser');
const engine = require('ejs-mate');
const ejs = require('ejs');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const _ = require('lodash')

const config = require('./config/secret');
const sessionStore = new MongoStore({url: config.database, autoReconnect: true});

const app = express();
const http = require('http').Server(app);

// connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true }, (err) => {
    if (err) console.log(err);
    console.log('Connected tothe database');
})

// passport authentication
require('./passport/passport-local');
require('./passport/passport-facebook');
require('./passport/passport-google');

// static files
app.use(express.static(__dirname + '/public'));

// templating engine ejs
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(cookieParser());
// parse the datainto object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());
app.use(morgan('dev'));
// storing session to database
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}));

//  flash messaging
app.use(flash());
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.req_user = req.user;
    res.locals._ = _;
    next();
});

require('./routes/user')(app, passport)


http.listen(config.port, (err) => {
    if (err) console.log(err);
    console.log(`App Starting at port: ${config.port}`)
})


