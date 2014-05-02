/**
 * Module dependencies.
 */

var http = require('http');
var path = require('path');

var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');

var app = express();

var routes = require('./routes');

app.set('port', process.env.PORT || 3000);
app.engine('.ejs', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('abcde'));
app.use(session({secret: 'demo', cookie: {maxAge: 360000}}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.user = req.session.user;

    res.locals.errorF = function() {
        var err = req.flash('error');
        if (err.length)
            return err;
        else
            return null;
    };
    res.locals.successF = function() {
        var succ = req.flash('success');
        if (succ.length)
            return succ;
        else
            return null;
    };
    next();
});


app.use(express.static(__dirname + '/public'));

//development
if(app.get('env') == 'development'){
    app.use(logger('dev'));
}

//production
if(app.get('env') == 'production'){
    app.use(logger());
}


//==== Router
app.get('/', routes.index);
//跳转到用户个人页面
// app.get('/u/:username', routes.checkLogin);
app.get('/u/:username', routes.user);
//发言
app.post('/post', routes.checkLogin);
app.post('/post', routes.post);
//跳转到注册页面
app.get('/reg', routes.checkNotLogin);
app.get('/reg', routes.reg);
//注册提交
app.post('/reg', routes.checkNotLogin);
app.post('/reg', routes.doReg);
//跳转到登录页面
app.get('/login', routes.checkNotLogin);
app.get('/login', routes.login);
//登录提交
app.post('/login', routes.checkNotLogin);
app.post('/login', routes.doLogin);
//注销
app.get('/logout', routes.checkLogin);
app.get('/logout', routes.logout);


app.use(function(req, res){
    res.end('ok');
});


if (!module.parent) {
    http.createServer(app).listen(app.get('port'), function() {
        console.log("Express server listening on port " + app.get('port'));
    });
}

module.exports = app;
