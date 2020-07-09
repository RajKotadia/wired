// initialize socket
const socket = io();

// DOM variables
const messageList = document.querySelector('.chat-messages');
const messageForm = document.querySelector('#message-form');
const locationButton = document.querySelector('#send-location');
const userList = document.querySelector('#users');
const roomName = document.querySelector('#room-name');
const userCount = document.querySelector('#user-count');
const messageInput = document.querySelector('input');

// scroll to the bottom when a new message is received
const autoscroll = () => {
    const threshold = messageList.scrollTop + messageList.clientHeight + 400;
    const shouldScrollToBottom = threshold >= messageList.scrollHeight;

    if (shouldScrollToBottom) {
        messageList.scrollTop = messageList.scrollHeight;
    }
};

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// on connecting with the server
socket.on('connect', () => {
    console.log('Connected to server');

    // join room event
    socket.emit(
        'join',
        {
            username: username.trim(),
            room: room.trim(),
        },
        (err) => {
            if (err) {
                alert(err);
                window.location.href = '/';
            } else {
                roomName.innerHTML = room;
            }
        }
    );
});

// to get the list of users within a room
socket.on('updateUserList', (userInfo) => {
    userCount.innerHTML = userInfo.length;

    // add the username to the DOM
    const users = userInfo
        .map((user) => {
            if (user.id === socket.id) {
                return `<li>${user.username} (You)</li>`;
            }

            return `<li>${user.username}</li>`;
        })
        .join('');

    userList.innerHTML = users;
});

// listening to custom message event - newMessage
socket.on('newMessage', (message) => {
    // render the received message to the DOM
    const div = document.createElement('div');

    if (message.from === 'Admin') {
        div.setAttribute('class', 'admin-message');
        div.innerHTML = `<p class="admin-text">${message.text}</p>`;
        messageList.append(div);
        return;
    }

    div.innerHTML = generateMessageHTML(
        message.from.username,
        message.text,
        message.createdAt
    );

    div.classList.add('message');
    if (message.from.id === socket.id) {
        div.classList.add('align-right');
    }
    messageList.append(div);
    autoscroll();
});

// listening for custom user location event - newLoationMessage
socket.on('newLocationMessage', (message) => {
    // render the received message to the DOM
    const div = document.createElement('div');

    div.innerHTML = generateLocationMessageHTML(
        message.from.username,
        message.url,
        message.createdAt
    );

    div.classList.add('message');
    if (message.from.id === socket.id) {
        div.classList.add('align-right');
    }

    messageList.append(div);
    autoscroll();
});

// indicates that a user is typing
socket.on('isTyping', (info) => {
    const infoElement = document.querySelector('.info');
    if (info.flag) {
        infoElement.style.display = 'block';
        infoElement.innerHTML = info.msg;
    } else {
        infoElement.style.display = 'none';
    }
});

// on getting disconnected from the server
socket.on('disconnect', () => console.log('Disconnected from server'));

// emit an event when a user is typing
messageInput.addEventListener('input', () => {
    socket.emit('typing', true);
});

// getting form data
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = messageForm.message.value;

    socket.emit('typing', false);

    // emitting a custom event - createMessage
    socket.emit(
        'createMessage',
        {
            text: message.trim(),
        },
        (data) => {
            // ack from the server
            messageForm.message.value = '';
        }
    );
});

// getting user location
locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your Browser');
    }

    locationButton.setAttribute('disabled', 'disabled');

    // accessing the users current location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // send location info via socket event
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            locationButton.removeAttribute('disabled');
        },
        (err) => {
            locationButton.removeAttribute('disabled');
            alert('Unable to fetch the current location');
        },
        {
            enableHighAccuracy: true,
        }
    );
});

const toggleButton = document.querySelector('#toggle-info');
const sidebar = document.querySelector('.chat-sidebar');

// toggle sidebar
toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
