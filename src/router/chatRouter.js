const router = require("express").Router();
const authMiddleware = require('../authMiddleware/authMiddleware');
const chatCtrl = require('../controller/chatCtrl')

router.get('/:id', authMiddleware , chatCtrl.addChat)

module.exports = router