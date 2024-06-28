const express = require('express')
const router = express.Router()
const {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
} = require('../controllers/user')

router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser)

module.exports = router