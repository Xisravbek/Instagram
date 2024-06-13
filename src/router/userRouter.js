const express = require('express')

const router = express.Router()

const usersCtrl = require('../controller/usersCtrl')

const authMiddlware = require('../authMiddleware/authMiddleware')

router.post('/signup',usersCtrl.SignUp)
router.post('/login',usersCtrl.Login)
router.get('/',usersCtrl.getAllUsers)
router.put('/:id',authMiddlware,usersCtrl.updateUser)
router.delete('/:id',authMiddlware,usersCtrl.deleteUser)

module.exports = router;