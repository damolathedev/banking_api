const User = require('../models/User')
const {attachCookiesToResponse, createTokenUser} = require('../utils')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../error')
const getDeviceInfo = require('../utils/getDeviceInfo')
const send2FACode = require('../utils/2FACode')


const createUser = async(req, res)=>{
    const user = await User.create(req.body)
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
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
    const deviceInfo = await getDeviceInfo(req)
    // const deviceInfo = 'qwertyuiop'
    const deviceRecorgnized = user.deviceIdentifiers.includes(deviceInfo)
    
    if(!deviceRecorgnized){
        const twofactorCode = user.generateTwofactorCode()
        await user.save()
        await send2FACode(user.email, twofactorCode)
        return res.status(StatusCodes.TEMPORARY_REDIRECT).json({ msg: '2FA code sent'})
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.OK).json({ user:tokenUser })
}

const verify2FA = async(req, res)=>{
    const {code} = req.body;
    const {userId} = req.user
    const user = await User.findById(userId)
    console.log(user);
    if(!user || !(await user.compareTwofactorCode(code))){
        throw new CustomError.UnauthenticatedError('Invalid 2FA code')
    }
    user.deviceIdentifiers.push(getDeviceInfo(req))
    await user.save()

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user:tokenUser })
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