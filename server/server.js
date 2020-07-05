const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to WIRED',
        createdAt: new Date().getTime(),
    });

    // emit a broadcast event
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'A new USer has just joined the Chat',
        createdAt: new Date().getTime(),
    });

    // listen to custom event - createMessage
    socket.on('createMessage', (data) => {
        console.log(data);

        // emit a broadcast event ot everyone
        io.emit('newMessage', {
            from: data.from,
            text: data.text,
            createdAt: new Date().toString(),
        });
    });

    // handle user disconnection
    socket.on('disconnect', () => console.log('User was disconnected'));
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server listening on port ${port}`));
