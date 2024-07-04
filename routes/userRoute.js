const express = require('express')
const router = express.Router()
const {
    createUser,
    login,
    logOut
} = require('../controllers/userController')
const deviceMiddleware = require('../middleware/device-middleware')

router.route('/register').post(createUser)
router.route('/login').post(deviceMiddleware, login)
router.route('/logout').get(logOut)

module.exports = router