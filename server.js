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
    console.log('User Connected: %s socktes connected socket id: %s',connections.length,socket.id);
     // disconnect
    socket.on('disconnect',function(data){

   // if (socket.username) return ;
    //users.splice(users.indexOf(socket.username),1);
    //borrando el usuario de un array de objeto
    users = users.filter(function(el) {
        return el.user !== socket.username;
    });

    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('User Disconnected: %s sockets connected',connections.length);
    });

    //send message
    socket.on('send message',function(data){
        var msg = data.trim();
        if(msg.substr(0,3) === '/w ') {
           msg = msg.substr(3);
           var ind = msg .indexOf(' ');
           if (ind !== -1 ){
             var name = msg.substr(0,ind);
             var msg = msg.substr(ind+1);
             var filtro = users.filter( el => (el.user === name));
             if( filtro.length > 0){
                 console.log('privado a %s con id : %s',name,filtro[0].socket);
                 io.sockets.connected[filtro[0].socket].emit('get message', {user: socket.username,msg: msg});
             }
             
            console.log('message private');
           }
        } else{
            io.emit('get message',{user: socket.username,msg: data});
        }
      
    });


    //new  user
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data
        users.push({
            user:socket.username,
            socket: socket.id
        });
       // console.log('server','new user');
        updateUsernames();
      

    });

    function updateUsernames(){
        io.emit('get user',{users:users});
     
    }

      //  socket.broadcast.to(socketid).emit('message', 'for your eyes only');
    




    
});