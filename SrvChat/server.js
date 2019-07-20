var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));


var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);
io.sockets.on('disconnect', disconnection);

var users = [];

function newConnection(socket) {
  console.log('New Connection: ' + socket.id);
  users.push(socket);
  socket.emit('name', {});
  socket.on('setName', function(data) {
    socket.chatName = data.name;
    socket.emit('join', {});
    io.emit('chatMsg', {sender: "Server", msg: data.name + ' has joined.'});
  });
  socket.on('send', function(data) {
    io.emit('chatMsg', {sender: socket.chatName, msg: data.msg});
  });
}

function disconnection(socket) {
  console.log("Disconnected: " + socket.id);
  io.emit('chatMsg', {sender: "Server", msg: socket.chatName + ' has disconnected.'})
  users = users.filter(user => user !== socket);
}


console.log("Server Running");
