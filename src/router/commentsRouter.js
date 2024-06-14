const router = require("express").Router();
const authMiddleware = require('../authMiddleware/authMiddleware');
const commentsCtrl = require('../controller/commentsCtrl')

router.post("/:id", authMiddleware ,  commentsCtrl.addComment)

module.exports = router;
