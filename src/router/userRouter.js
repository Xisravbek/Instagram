const express = require('express')

const router = express.Router()

const usersCtrl = require('../controller/usersCtrl')

const authMiddlware = require('../authMiddleware/authMiddleware')

router.post('/signup',usersCtrl.SignUp)
router.post('/login',usersCtrl.Login)
router.get('/search',usersCtrl.searchUsers)
router.get('/',usersCtrl.getAllUsers)
router.get('/:id',usersCtrl.getUser)
router.put('/:id',authMiddlware,usersCtrl.updateUser)
router.delete('/:id',authMiddlware,usersCtrl.deleteUser)

module.exports = router;