const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
server.listen(3000);
console.log('server is running...');
var usernames = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    //socket.emit('request', console.log('request')); // emit an event to the socket
    //io.emit('broadcast', console.log('broad')); // emit an event to all connected sockets
    console.log('Socket Connected...');

    socket.on('new user', (user, cb)=> {
        if(usernames.indexOf(user) != -1){
            cb(false);
        } else {
            cb(true);
            socket.username = user;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    // Update Usernames
    function updateUsernames() {
        io.emit('usernames', usernames);
    }

    socket.on('send message', data => {
        io.emit('new message', {msg : data, user : socket.username});
    }); // listen to the event

    // Disconnect
    socket.on('disconnect', ()=> {
        if(!socket.username) {
            return;
        }

        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    });
  });