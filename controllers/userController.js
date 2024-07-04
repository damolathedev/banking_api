const User = require('../models/User')
const {attachCookiesToResponse, createTokenUser} = require('../utils')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../error')


const createUser = async(req, res)=>{
    const user = await User.create(req.body)
    //convert mongoose document to plain object so i can remove pin from the object
    const userObject = user.toObject()
    delete userObject.pin;
    const tokenUser = createTokenUser(userObject)
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.CREATED).json({ user })
}

const login = async(req, res)=>{
    const {email, pin} = req.body
    if((!email || !pin)){
        throw new CustomError.BadRequestError('Please provide email and pin')
    }
    const user = await User.findOne({email})
    // console.log(user);
    if(!user){
        throw new CustomError.UnauthenticatedError('Phone number incorrect')
    }
    const isPinCorrect = await user.comparePin(pin)
    if(!isPinCorrect){
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
    logOut
}