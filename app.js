/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');

var partials = require('express-partials');
var flash = require('connect-flash');
var fs = require('fs');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var sessionStore = new MongoStore({
    db: settings.db
}, function() {
    console.log('sessionStore connect mongodb success...');
});

var accessLogfile = fs.createWriteStream('access.log', {
    flags: 'a'
});
var errorLogfile = fs.createWriteStream('error.log', {
    flags: 'a'
});

var app = express();

app.configure(function() {
    app.use(express.logger({
        stream: accessLogfile
    }));

    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    //add
    app.use(partials());
    app.use(flash());
    //---
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    //add
    app.use(express.cookieParser());
    app.use(express.session({
        secret: settings.cookieSecret,
        cookie: {
            maxAge: 60000 * 20
        },
        store: sessionStore
    }));
    
    app.use(function(req, res, next) {

        //console.log("ttttttttttest-flash--error:" + req.flash('error'));
        res.locals.user = req.session.user;
        res.locals.errorF = function() {
            var err = req.flash('error');
            //console.log("ttttttttttest-flash--err:" + err);
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
    //---
    //app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.configure('production', function() {
    app.error(function(err, req, res, next) {
        var meta = '[' + new Date() + ']' + req.url + '\n';
        errorLogfile.write(meta + err.stack + '\n');
    });
});

app.get('/', routes.index);
//跳转到用户个人页面
//app.get('/u/:username',routes.checkLogin);
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

//test
app.get('/list', function(req, res) {
    res.render('list', {
        title: 'List',
        items: [11, 22, 'aa', 'bb']
    });
})

if (!module.parent) {
    http.createServer(app).listen(app.get('port'), function() {
        console.log("Express server listening on port " + app.get('port'));
    });
}

module.exports = app;
