const User = require('../models/User')
const {attachCookiesToResponse, createTokenUser} = require('../utils')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../error')
const getDeviceInfo = require('../utils/getDeviceInfo')
const send2FACode = require('../utils/2FACode')


const createUser = async(req, res)=>{
    const user = await User.create(req.body)
    //convert mongoose document to plain object so i can remove pin from the object
    const userObject = user.toObject()
    delete userObject.pin;
    const tokenUser = createTokenUser(userObject)
    attachCookiesToResponse({res, user:tokenUser})
    user.deviceIdentifier = await getDeviceInfo(req)
    await user.save()
    res.status(StatusCodes.CREATED).json({ user })
}

const login = async(req, res)=>{
    const {email, pin} = req.body
    if((!email || !pin)){
        throw new CustomError.BadRequestError('Please provide email and pin')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid Cridentials')
    }
    const isPinCorrect = await user.comparePin(pin)
    if(!isPinCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Cridentials')
    }
    // const deviceInfo = await getDeviceInfo(req)
    const deviceInfo = 'qwertyuiop'
    const isdeviceInfoCorrect = await user.compareDevice(deviceInfo)
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    if(!isdeviceInfoCorrect){
        res.redirect(StatusCodes.TEMPORARY_REDIRECT,'/verify-2fa')
        send2FACode(user)
        return
    }
    
    res.status(StatusCodes.OK).json({ user:tokenUser })
}

const verify2FA = async(req, res)=>{
    const {code} = req.body
    const {name, userId} = req.user
    const user = await User.findOne({_id:userId})
    if(!user){
        throw new CustomError.UnauthorizedError('Routh not authorized')
    }
    const isTwofactorCodeCorrect = await user.compareTwofactorCode(code)
    if(!isTwofactorCodeCorrect){
        throw new CustomError.UnauthenticatedError('Invalid Cridentials')
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.OK).json({ user:tokenUser })
}

const logOut = async(req, res)=>{
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    })
    res.status(StatusCodes.OK).json({ msg:'user logged out!'})
}

module.exports = {
    createUser,
    login,
    verify2FA,
    logOut
}