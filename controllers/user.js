var User = require('../models/user.js');
var Post = require('../models/post.js');

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

exports.logout = function(req,res){
    req.session.user = null;
    req.flash('success','注销成功');
    return res.redirect('/');
};