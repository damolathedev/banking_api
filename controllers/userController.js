const CustomError = require('../error')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {attachCookiesToResponse, createTokenUser} = require('../utils')
const path = require('path')

const uploadUserInfo = async(req, res)=>{
    const {firstName, middleName, lastName, gender, dateOfBirth} = req.body

    if(!firstName || !middleName || !lastName || !gender || !dateOfBirth){
        throw new CustomError.BadRequestError('No field must be left unfilled')
    }

    const user =await User.findOne({_id:req.user.userId})
    if(!user){
        throw new CustomError.BadRequestError('User not found')
    }

    user.firstName = firstName
    user.middleName = middleName
    user.lastName = lastName
    user.gender = gender
    user.dateOfBirth = dateOfBirth
    await user.save()

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.CREATED).json( tokenUser )
}

const uploadUserImage = async(req, res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError('No file uploaded')
    }
    const userImage = req.files.image
    if(!userImage){
        throw new CustomError.BadRequestError('Please upload Image')
    }
    const maxSize = 1024 * 1024
    if(userImage.sizw > maxSize){
        throw new CustomError.BadRequestError('Please upload image smaller than 1mb')
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${userImage.name}`)
    const user = await User.findOne({_id:req.user.userId})
    user.profilePic = `/public/uploads/${userImage.name}`
    await user.save()
    await userImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: { src: `/uploads/${userImage.name}` } });
}

module.exports = {uploadUserInfo, uploadUserImage}