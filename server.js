var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
//var io = require('socket.io').listen(server);  //linux
var io = require('socket.io').listen(server, { wsEngine: 'ws' }); //windows
users = [];
connections = [];

server.listen(port, function () {
    console.log('Server listening at port %d', port);
  });
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection',function(socket){
    connections.push(socket);
    console.log('User Connected: %s socktes connected',connections.length);
     // disconnect
    socket.on('disconnect',function(data){

   // if (socket.username) return ;
    users.splice(users.indexOf(socket.username),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('User Disconnected: %s sockets connected',connections.length);
    });

    //send message
    socket.on('send message',function(data){
        
        io.emit('get message',{user: socket.username,msg: data});
    });


    //new  user
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data
        users.push(socket.username);
        console.log('server','new user',data);
        updateUsernames();
      

    });
    
    function updateUsernames(){
        io.emit('get user',users);
    }



    
});