/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')({session: session});
var flash = require('connect-flash');
var logger = require('morgan');
var compression = require('compression');

var settings = require('./settings.js');
var viewHelpers = require('./utils/viewHelpers.js');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');


var app = express();

app.set('port', process.env.PORT || 3000);
app.engine('.ejs', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.disable('x-powered-by');

app.use(bodyParser());
app.use(multer());
app.use(methodOverride());
app.use(cookieParser('abcde'));
app.use(session({
    secret: 'demo',
    cookie: {maxAge: 360000},
    store: new MongoStore({
        url: settings.host + '/' + settings.db,
        collection: 'sessions',
        auto_reconnect: true
    })
}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});
app.use(viewHelpers());


app.use(express.static(__dirname + '/public'));

//development
if(app.get('env') == 'development'){
    app.use(logger('dev'));
}

//production
if(app.get('env') == 'production'){
    app.use(logger());
    app.use(compression({
        filter: function(req, res){
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));
}


// Router
app.use(indexRouter);
app.use(userRouter);


if (!module.parent) {
    http.createServer(app).listen(app.get('port'), function() {
        console.log("Express server listening on port " + app.get('port'));
    });
}

module.exports = app;
