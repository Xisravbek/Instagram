const Notification = require('./models/Notification');
const Posts = require('../model/postsModel');
const User = require('./models/User');

async function createCommentNotification(postId, commenterId, commentText) {
    const post = await Posts.findById(postId).populate('userId');
    const user = await User.findById(commenterId);

    if (!post || !user) {
        throw new Error('Post or User not found');
    }

    const notification = new Notification({
        userId: post.userId._id,
        type: 'comment',
        message: `${user.username} commented on your post: "${commentText}"`,
    });

    await notification.save();
}

// Вызов функции при добавлении комментария
createCommentNotification(postId, commenterId, commentText)
    .then(() => console.log('Notification created'))
    .catch(console.error);

const NotificationCtrl = {
    createCommentNotification : async (req , res ) => {
        try {
            const userId = req.user._id;
            const {commenterId, postId} = req.body.commenterId;

            const post = await Posts.findById(postId).populate('userId');
            const user = await User.findById(commenterId);

            if(!post || !user) {
                return res.status(404).send({message: "Post or User not found"});
            }

            const notification = new Notification({
                userId: post.userId._id,
                type: "comment",
                message: `${user.userName} commented on your post: ${commentText}`
            })


        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}