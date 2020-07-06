// initialize socket
const socket = io();

// DOM variables
const messageList = document.querySelector('#messages');
const messageForm = document.querySelector('#message-form');

// on connecting with the server
socket.on('connect', () => {
    console.log('Connected to server');

    // listening to custom event - newMessage
    socket.on('newMessage', (message) => {
        console.log('newMessage', message);

        // render the received message to the DOM
        const li = document.createElement('li');
        li.innerHTML = `${message.from}: ${message.text}`;
        messageList.append(li);
    });
});

// getting form data
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = messageForm.message.value;

    // emitting a custom event - createMessage
    socket.emit(
        'createMessage',
        {
            from: 'User',
            text: message,
        },
        (data) => {
            // ack from the server
            console.log(data);
        }
    );
});

// on getting disconnected from the server
socket.on('disconnect', () => console.log('Disconnected from server'));
