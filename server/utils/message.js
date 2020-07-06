// generate the normal text message
const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime(),
    };
};

// generate the location message
const generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime(),
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage,
};
