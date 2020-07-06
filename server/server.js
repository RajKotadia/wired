const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

// initialize the app and create a server to work with socketio
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// set static path
app.use(express.static(path.join(__dirname, '../public')));

// socket connection event
io.on('connection', (socket) => {
    console.log('New User connected');

    // emit custom event - newMessage
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to WIRED!'));

    // emit a broadcast event
    socket.broadcast.emit(
        'newMessage',
        generateMessage('Admin', 'New User joined the chat')
    );

    // listen to custom event - createMessage
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        // send an acknowledgement to the client
        callback('Message received by the server');

        // emit a broadcast event ot everyone
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    // handle user disconnection
    socket.on('disconnect', () => console.log('User was disconnected'));
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server listening on port ${port}`));
