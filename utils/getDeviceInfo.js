const getDeviceInfo = (req) => {
    return req.headers['user-agent'];
};

module.exports = getDeviceInfo;
