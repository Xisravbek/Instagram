const express = require('express')

const router = express.Router()

const usersCtrl = require('../controller/usersCtrl')

router.post('/signup',usersCtrl.SignUp)

module.exports = router;