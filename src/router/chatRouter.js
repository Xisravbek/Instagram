const router = require("express").Router();
const authMiddleware = require('../authMiddleware/authMiddleware');
const chatCtrl = require('../controller/chatCtrl')

router.get('/:id', authMiddleware , chatCtrl.addChat);
router.get('/', authMiddleware , chatCtrl.getAllChats)
router.delete('/:id', authMiddleware , chatCtrl.deleteChat)

module.exports = router