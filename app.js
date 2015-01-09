var express = require('express');
var path = require('path');
var array = require('./common');
var app = express();
var underscore = require('underscore')
var server = require('http').Server(app);
var io = require('socket.io')(server);
//server.listen(3000);

var clientSockets=new Array();


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'bower_components')));

app.get('/',function(req,res) {
    res.render('index');
})
io.set('authorization',function(handShakeData,callback) {
    var he = handShakeData.headers;
    console.log(he);
    var mycookie = handShakeData.headers.cookie;
    console.log(mycookie);
    callback(null,true);
})
io.on('connection',function(socket) {

    if(!underscore.contains(clientSockets,socket)){
        clientSockets.push(socket);
    }
    socket.on('clientMsg',function(data) {
       flashMsg(data);
    });
    socket.on('disconnect',function() {
       var i = clientSockets.indexOf(socket)
        clientSockets.splice(i,1);
    });
})
//io.configure(function(){
//    io.set('authorization',function(handShakeData,callback) {
//        console.log(handShakeData);
//        callback(null,true);
//    })
//})
var flashMsg = function(data){
    for(var i in clientSockets){

        clientSockets[i].emit('news',data);
    }
}

module.exports = server;

