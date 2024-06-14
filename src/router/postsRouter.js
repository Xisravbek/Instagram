const express = require('express');
const authMiddlware = require('../authMiddleware/authMiddleware');
const postCtrl = require('../controller/postsCtrl')
const router = express.Router();

router.post('/', authMiddlware, postCtrl.addPost );
router.get('/', postCtrl.getPosts );
router.get('/:id', postCtrl.getOnePost );
router.delete("/:id", authMiddlware , postCtrl.deletePost);
router.put('/:id', authMiddlware , postCtrl.updatePost);

module.exports = router