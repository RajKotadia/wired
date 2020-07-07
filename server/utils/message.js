const { format } = require('date-fns');

// generate the normal text message
const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: format(new Date().getTime(), 'h:mm a'),
    };
};

// generate the location message
const generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: format(new Date().getTime(), 'h:mm a'),
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage,
};
