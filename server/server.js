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

    // handle user disconnection
    socket.on('disconnect', () => console.log('User was disconnected'));
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server listening on port ${port}`));
