const express = require('express')
const router = express.Router()
const {
    createUser,
    login,
    verify2FA,
    logOut
} = require('../controllers/userController')
const authentication = require('../middleware/authentication')

router.route('/register').post(createUser)
router.route('/login').post(login)
router.post('/verify-2fa',authentication, verify2FA)
router.route('/logout').get(logOut)

module.exports = router