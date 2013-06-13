
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

exports.checkLogin = function (req,res,next){
    if(!req.session.user){
        req.flash('error','未登录');
        return res.redirect('/login');
    };
    next();
};

exports.checkNotLogin = function (req,res,next){
    if(req.session.user){
        req.flash('error','已登录,请注销后操作.');
        return res.redirect('/');
    };
    next();
};

exports.index = function(req, res){
  return res.render('index', { title: '首页' });
};

exports.user = function(req,res){
    User.get(req.params.username,function(err,user){
        if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/');
        }
        Post.get(user.name,function(err,posts){
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            res.render('user',{
                title: user.name,
                posts: posts,
                items:[11,22,'aa','bb']
            });
        });
    });
};

exports.post = function(req,res){
    var currentUser = req.session.user;
    var post = new Post(currentUser.name,req.body.post);
    post.save(function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/');
        }
        req.flash('success','发表成功');
        return res.redirect('/u/' + currentUser.name);
    });
};

exports.reg = function(req,res){
    return res.render('reg',{title:'用户注册'});
};


exports.doReg = function(req,res){
    if(req.body.password.length == 0 || req.body.username.length == 0){
        req.flash('error','用户名或密码不能为空');
        return res.redirect('/reg');
    };
    if(req.body['password-repeat'] != req.body['password']){
        req.flash('error','两次输入的口令不一致');
        return res.redirect('/reg');
    };
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
        name:req.body.username,
        password:password
    });

    User.get(newUser.name,function(err,user){
        if(user){
            err = '用户名已经存在,请重新输入.';
        }
        if(err){
            req.flash('error',err);
            return res.redirect('/reg');
        }

        newUser.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','注册成功');
            return res.redirect('/');
        });
    });
};

exports.login = function(req,res){
//    console.log("-----------login-----------:");
    return res.render('login',{title:'用户登录'});
};

exports.doLogin = function(req,res){
    if(req.body.password.length == 0 || req.body.username.length == 0){
        req.flash('error','用户名或密码不能为空');
        return res.redirect('/login');
    };

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
//    console.log("-----------doLogin-----------:" + password);
    User.get(req.body.username,function(err,user){
        // console.log('--------------------------');
        // console.log('err:' + err);
        // console.log('user:' + user);
        if(!user){
            req.flash('error','用户名不存在');
            return res.redirect('/login');
        };
        if(password != user.password){
            req.flash('error','用户名或密码输入有误')
            return res.redirect('/login');
        };
        req.session.user = user;
        req.flash('success','登录成功');
        return res.redirect('/');
    });
};

exports.logout = function(req,res){
    req.session.user = null;
    req.flash('success','注销成功');
    return res.redirect('/');
};