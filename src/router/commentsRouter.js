const router = require("express").Router();
const authMiddleware = require('../authMiddleware/authMiddleware');
const commentsCtrl = require('../controller/commentsCtrl')

router.post("/", authMiddleware ,  commentsCtrl.addComment);
router.delete('/:id', authMiddleware , commentsCtrl.deleteComment)

module.exports = router;
