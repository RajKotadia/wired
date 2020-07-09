const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isValidString } = require('./utils/validation');
const Users = require('./utils/Users');

// initialize the app and create a server to work with socketio
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

// set static path
app.use(express.static(path.join(__dirname, '../public')));

// socket connection event
io.on('connection', (socket) => {
    console.log('New User connected');

    // listening to join room event
    socket.on('join', (roomData, callback) => {
        const { username, room } = roomData;

        // validate the data
        if (!isValidString(username) || !isValidString(room)) {
            return callback('Please provide valid details.');
        }

        // check if a user with same username already exists in the given room
        const userList = users.getUserList(room);
        const userExists = userList.filter(
            (user) => user.username === username
        )[0];

        if (userExists) {
            return callback(
                'Username already taken. Please try a different username!'
            );
        }

        // add the user to the room
        socket.join(room);

        users.removeUser(socket.id);
        users.addUser(socket.id, username, room);

        // emit custom event - newMessage (to welcome the new user)
        socket.emit(
            'newMessage',
            generateMessage('Admin', `Welcome to the "${room}" room!`)
        );

        // emit a broadcast event - to provide an update to the other users
        socket.broadcast
            .to(room)
            .emit(
                'newMessage',
                generateMessage('Admin', `${username} joined the chat`)
            );

        // to send room info to the client
        io.to(room).emit('updateUserList', users.getUserList(room));

        // send back the acknowledgement
        callback();
    });

    // listen to custom event - createMessage
    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);

        if (user && isValidString(message.text)) {
            // emit a broadcast event ot everyone
            io.to(user.room).emit(
                'newMessage',
                generateMessage(user, message.text)
            );
        }

        // send an acknowledgement to the client
        callback('Message received by the server');
    });

    // listen for user location event - createLocationMessage
    socket.on('createLocationMessage', (locationInfo) => {
        const user = users.getUser(socket.id);

        io.to(user.room).emit(
            'newLocationMessage',
            generateLocationMessage(
                user,
                locationInfo.latitude,
                locationInfo.longitude
            )
        );
    });

    // handler for typing event
    socket.on('typing', (flag) => {
        const user = users.getUser(socket.id);

        if (!flag) {
            return socket.broadcast.to(user.room).emit('isTyping', {
                flag: false,
            });
        }
        socket.broadcast.to(user.room).emit('isTyping', {
            flag: true,
            msg: `${user.username} is Typing...`,
        });
    });

    // handle user disconnection
    socket.on('disconnect', () => {
        console.log('User was disconnected');

        // remove the user from the room
        const user = users.removeUser(socket.id);
        if (user) {
            socket.leave(user.room);
            io.to(user.room).emit(
                'newMessage',
                generateMessage('Admin', `${user.username} left the chat`)
            );

            io.to(user.room).emit(
                'updateUserList',
                users.getUserList(user.room)
            );
        }
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server listening on port ${port}`));
