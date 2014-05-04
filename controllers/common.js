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