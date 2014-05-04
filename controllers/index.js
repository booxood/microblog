var crypto = require('crypto');
var User = require('../models/user.js');

exports.index = function(req, res){
  return res.render('index', { title: '首页' });
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
    return res.render('login',{title:'用户登录'});
};

exports.doLogin = function(req,res){
    if(req.body.password.length == 0 || req.body.username.length == 0){
        req.flash('error','用户名或密码不能为空');
        return res.redirect('/login');
    };

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.body.username,function(err,user){
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

