const Likes = require('../model/likesModel');
const { findOneAndDelete } = require('../model/usersModel');


const likesCtrl = {
    addLike: async (req, res ) => {
        try {
            const userId = req.user._id;
            const {id} = req.params;
            const oldLike = await Likes.findOneAndDelete({postId : id , userId});
            if(!oldLike){
                const like = await Likes.create({userId , postId: id})
                
                return res.status(201).send({message: "like was added"})
            }
            
            return res.status(200).send({message: "Like was canceled"})

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = likesCtrl