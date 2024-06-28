const User = require('../models/User')


const createUser = async(req, res)=>{
    res.send('create user')
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