const crypto = require('crypto');
const Device = require('../models/Device')

const generateDeviceIdentifier = async(req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = req.ip;
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const referer = req.headers['referer'] || '';

  const uniqueString = userAgent + ipAddress + acceptLanguage + acceptEncoding + referer;
  const hash = crypto.createHash('sha256');
  hash.update(uniqueString);
  req.deviceIdentifier = hash.digest('hex');

  const existingDevice = await Device.findOne({})
  console.log(req.session)

  // return existingDevice

  next();
};

module.exports = generateDeviceIdentifier;
