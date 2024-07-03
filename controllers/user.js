const User = require('../models/User')
const {attachCookiesToResponse, createTokenUser} = require('../utils')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../error')


const createUser = async(req, res)=>{
    const user = await User.create(req.body)
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    console.log(tokenUser);
    res.status(StatusCodes.CREATED).json({ user })
}

const login = async(req, res)=>{
    const {phoneNumber, pin} = req.body
    if((!phoneNumber || !pin)){
        throw new CustomError.BadRequestError('Please provide phone number and pin')
    }
    
}


module.exports = {
    createUser,
}