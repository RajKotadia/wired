const socket = io();

// on connecting with the server
socket.on('connect', () => {
    console.log('Connected to server');

    // listening to custom event - newMessage
    socket.on('newMessage', (data) => {
        console.log(data);
    });

    // emitting a custom event - createMessage
    // socket.emit('createMessage', {
    //     from: 'John Doe',
    //     text: 'Hey everyone',
    // });
});

// on getting disconnected from the server
socket.on('disconnect', () => console.log('Disconnected from server'));
