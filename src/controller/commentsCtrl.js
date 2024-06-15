const Posts = require('../model/postsModel');
const Comments = require('../model/CommentsModel')

const commentsCtrl = {
    addComment: async (req, res ) => {
        try {
            const userId = req.user._id;
            const {text , postId} = req.body;

            const post = await Posts.findById(postId);

            if(!post){
                return res.status(404).send({message: "Not founded"})
            }

            const comment = await Comments.create({userId, postId , text})
            return res.status(201).send({message: "comment add", comment});

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deleteComment: async (req, res) => {
        try {
            const userId = req.user._id;
            const id = req.params.id;
            const comment = await Comments.findById(id);
            if(!comment) {
                return res.status(404).send({message: "not found"})
            }
            if(req.user.isAdmin || userId == comment.userId ){
                await Comments.findByIdAndDelete(id);
                return res.status(200).send({message: "Deleted"})
            }else{
                return res.status(405).send({message: "Not allowed"})
            }
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = commentsCtrl