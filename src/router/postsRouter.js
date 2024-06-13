const express = require('express');
const authMiddlware = require('../authMiddleware/authMiddleware');
const postCtrl = require('../controller/postsCtrl')
const router = express.Router();

router.post('/', authMiddlware, postCtrl.addPost );
router.get('/', postCtrl.getPosts )

module.exports = router