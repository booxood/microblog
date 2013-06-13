/**
 * Created by JetBrains WebStorm.
 * User: Administrator
 * Date: 12-10-14
 * Time: 下午11:40
 * To change this template use File | Settings | File Templates.
 */
var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(settings.db,new Server(settings.host, Connection.DEFAULT_PORT, {}));
