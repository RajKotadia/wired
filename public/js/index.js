// setting the viewport height
document.documentElement.style.setProperty(
    '--height',
    `${window.innerHeight}px`
);

// resetting the viewport height on resize
window.onresize = () => {
    document.documentElement.style.setProperty(
        '--height',
        `${window.innerHeight}px`
    );
};

// initialize socket
const socket = io();

// DOM variables
const messageList = document.querySelector('.chat-messages');
const messageForm = document.querySelector('#message-form');
const locationButton = document.querySelector('#send-location');
const userList = document.querySelector('#users');
const roomName = document.querySelector('#room-name');
const userCount = document.querySelector('#user-count');
const toggleButton = document.querySelector('#toggle-info');
const sidebar = document.querySelector('.chat-sidebar');

// scroll to the bottom when a new message is received
const autoscroll = () => {
    const threshold = messageList.scrollTop + messageList.clientHeight + 290;
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
                console.log('No Error');
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
    console.log('newMessage', message);

    const div = document.createElement('div');

    if (message.from === 'Admin') {
        div.setAttribute('class', 'admin-message');
        div.innerHTML = `<p class="admin-text">${message.text}</p>`;
        messageList.append(div);
        return;
    }

    // render the received message to the DOM
    div.setAttribute('class', 'message');
    div.innerHTML = `                        
                        <p class="meta">${message.from} <span>${message.createdAt}</span></p>
                        <p class="text">${message.text}</p>
                    `;
    messageList.append(div);
    autoscroll();
});

// listening for custom user location event - newLoationMessage
socket.on('newLocationMessage', (message) => {
    console.log('newLocationMessage', message);

    // render the received message to the DOM
    const div = document.createElement('div');
    div.setAttribute('class', 'message');
    div.innerHTML = `
    <p class="meta">${message.from} <span>${message.createdAt}</span></p>
    <p class="text"><a href="${message.url}" target="_blank">Shared Current Location</a></p>
`;
    messageList.append(div);
    autoscroll();
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
            text: message.trim(),
        },
        (data) => {
            // ack from the server
            console.log(data);
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
                from: 'User',
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

// toggle sidebar
toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
