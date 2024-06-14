const Posts = require('../model/postsModel');
const Comments = require('../model/CommentsModel')

const commentsCtrl = {
    addComment: async (req, res ) => {
        try {
            const userId = req.user._id;
            const postId = req.params.id;
            const {text} = req.body;

            const post = await Posts.findById(postId);

            if(!post){
                return res.status(404).send({message: "Not founded"})
            }

            const comment = await Comments.create({userId, postId , text})
            return res.status(201).send({message: "comment add", comment});

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = commentsCtrl