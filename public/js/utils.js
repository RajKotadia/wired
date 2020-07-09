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
