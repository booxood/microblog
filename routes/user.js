var userRouter = require('express').Router();

var user = require('../controllers/user');
var common = require('../controllers/common');

userRouter
    .get('/u/:username', user.user)
    .post('/post', common.checkLogin, user.post)
    .get('/logout', common.checkLogin, user.logout);

 module.exports = userRouter;