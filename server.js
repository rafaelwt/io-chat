var express = require('express');
var app = express();
var server = require('http').createServer(app);

//var io = require('socket.io').listen(server);  //linux
var io = require('socket.io')(server, { wsEngine: 'ws' }).listen(server); //windows
users = [];
connections = [];

server.listen(process.env.PORT || 3000 );
console.log('Server running ..');
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection',function(socket){
    connections.push(socket);
    console.log('User Connected: %s socktes connected',connections.length);
     // disconnect
    socket.on('disconnect',function(data){
       
    connections.splice(connections.indexOf(socket),1);
    console.log('User Disconnected: %s sockets connected',connections.length);
    });

    //send message
    socket.on('send message',function(data){
        io.emit('send message',{msg: data});
    });
    
});