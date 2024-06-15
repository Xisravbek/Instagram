const router = require("express").Router();
const authMiddleware = require('../authMiddleware/authMiddleware');
const messageCtrl = require('../controller/messagesCtrl')

router.post('/', authMiddleware , messageCtrl.addMessage )

module.exports = router;
