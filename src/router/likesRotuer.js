const router = require("express").Router();
const authMiddleware = require('../authMiddleware/authMiddleware');
const likesCtrl = require('../controller/likesCtrl')

router.post('/:id', authMiddleware , likesCtrl.addLike )

module.exports = router;
