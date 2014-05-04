var indexRouter = require('express').Router();

var index = require('../controllers/index');
var common = require('../controllers/common');

indexRouter
    .get('/', index.index)
    .get('/reg', common.checkNotLogin, index.reg)
    .post('/reg', common.checkNotLogin, index.doReg)
    .get('/login', common.checkNotLogin, index.login)
    .post('/login', common.checkNotLogin, index.doLogin);

 module.exports = indexRouter;