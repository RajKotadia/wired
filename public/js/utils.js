window.onload = () => {
    
    if(window.location.pathname === '/') {
        // Get room name from URL - the room name will be present as a querystring for the room invite link
        const { room } = Qs.parse(location.search, {
            ignoreQueryPrefix: true,
        });
        
        if (room) {
            const roomInput = document.getElementById('room');
            roomInput.value = room;
        }
    }
}

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

// generate the HTML content for text message
const generateMessageHTML = (from, text, createdAt) => {
    const html = `
		<p class="meta">${from} <span>${createdAt}</span></p>
		<p class="text">${text}</p>
	`;

    return html;
};

// generate the HTML content for location message
const generateLocationMessageHTML = (from, url, createdAt) => {
    const html = `
		<p class="meta">${from} <span>${createdAt}</span></p>
		<p class="text"><a href="${url}" target="_blank">Shared Current Location</a></p>
	`;

    return html;
};
