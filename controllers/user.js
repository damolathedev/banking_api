const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')


const createUser = async(req, res)=>{
    const user = await User.create(req.body)
    res.status(StatusCodes.CREATED).json({ user })
}

const getAllUsers =async (req, res)=>{
    res.send('Get all users')
}

const getSingleUser =async (req, res)=>{
    res.send('Get single user')
}

const updateUser =async (req, res)=>{
    res.send('Update user')
}

const deleteUser = async(req, res)=>{
    res.send('Delete user')
}


module.exports = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}