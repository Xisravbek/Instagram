const router = require("express").Router();
const authMiddleware = require('../authMiddleware/authMiddleware');
const fallowCtrl = require('../controller/fallowCtrl')

router.get('/:id', authMiddleware , fallowCtrl.falow)

module.exports = router;
