// initialize socket
const socket = io();

// DOM variables
const messageList = document.querySelector('#messages');
const messageForm = document.querySelector('#message-form');
const locationButton = document.querySelector('#send-location');

// on connecting with the server
socket.on('connect', () => {
    console.log('Connected to server');
});

// listening to custom message event - newMessage
socket.on('newMessage', (message) => {
    console.log('newMessage', message);

    // render the received message to the DOM
    const li = document.createElement('li');
    li.innerHTML = `${message.from}: ${message.text}`;
    messageList.append(li);
});

// listening for custom user location event - newLoationMessage
socket.on('newLocationMessage', (message) => {
    console.log('newLocationMessage', message);

    // render the received message to the DOM
    const li = document.createElement('li');
    li.innerHTML = `${message.from}:  <a href="${message.url}" target="_blank">Current Location</a>`;
    messageList.append(li);
});

// on getting disconnected from the server
socket.on('disconnect', () => console.log('Disconnected from server'));

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

// getting user location
locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your Browser');
    }

    // accessing the users current location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // send location info via socket event
            socket.emit('createLocationMessage', {
                from: 'User',
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        },
        (err) => {
            alert('Unable to fetch the current location');
        }
    );
});
