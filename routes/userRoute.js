const express = require('express')
const router = express.Router()
const {
    createUser,
} = require('../controllers/user')

router.route('/register').post(createUser)
// router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser)

module.exports = router