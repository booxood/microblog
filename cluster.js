/**
 * Created by JetBrains WebStorm.
 * User: Administrator
 * Date: 12-10-25
 * Time: 下午10:18
 * To change this template use File | Settings | File Templates.
 */
var cluster = require('cluster');
var os = require('os');
var util = require('util');
var http = require('http');

var numCPUs = os.cpus().length;
// var numCPUs = 1;
//console.log("numCPUs : " + util.inspect(os.cpus()));
var workers = {};
if(cluster.isMaster){
    cluster.on('death',function(worker){
        delete workers[worker.pid];
        worker = cluster.fork();
        workers[worker.pid] = worker;
    });

    for(var i=0;i<numCPUs;i++){
        var worker = cluster.fork();
        workers[worker.pid] = worker;
        // console.log("----workers : " + util.inspect(workers));
    }
}else{
    var app = require('./app');
    app.listen(8080);
}

process.on('SIGTERM',function(){
    for(var pid in workers){
        process.kill(pid);
    }
    process.exit(0);
})
