const express = require('express')
const router = express.Router()
const {uploadUserInfo, uploadUserImage} = require('../controllers/userController')
const authMiddleware = require('../middleware/authentication')

router.patch('/user/uploadInfo', authMiddleware, uploadUserInfo)
router.patch('/user/uploadImage', authMiddleware, uploadUserImage)

module.exports = router