/**
 * Created by JetBrains WebStorm.
 * User: Administrator
 * Date: 12-10-15
 * Time: 下午11:26
 * To change this template use File | Settings | File Templates.
 */
var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;

User.prototype.save = function save(callback){
    var user = {
        name:this.name,
        password:this.password
    };

    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //read
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //add index
            collection.ensureIndex('name',{unique:true});
            //write
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                callback(err,user);
            });
        });
    });
};

User.get = function get(username, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            //find
            collection.findOne({name: username}, function(err, doc) {
                mongodb.close();
                if (doc) {
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};