const express = require('express')
const router = express.Router()
const {
    createUser,
    login,
    logOut
} = require('../controllers/userController')

router.route('/register').post(createUser)
router.route('/login').post(login)
router.route('/logout').get(logOut)

module.exports = router