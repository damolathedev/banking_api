const getDeviceInfo = async(req)=>{
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip;
    const acceptLanguage = req.headers['accept-language'] || '';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const referer = req.headers['referer'] || '';

    const uniqueString = userAgent + ipAddress + acceptLanguage + acceptEncoding + referer;

    return uniqueString
}

module.exports = getDeviceInfo