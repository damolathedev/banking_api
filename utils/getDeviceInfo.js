const bcrypt = require('bcrypt')

const getDeviceInfo = async(req)=>{
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip;
    const acceptLanguage = req.headers['accept-language'] || '';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const referer = req.headers['referer'] || '';

    const uniqueString = userAgent + ipAddress + acceptLanguage + acceptEncoding + referer;
    const salt = await bcrypt.genSalt(10)
    const hashedDevideInfo = await bcrypt.hash(uniqueString, salt)


    console.log(hashedDevideInfo);

    return hashedDevideInfo
}

module.exports = getDeviceInfo