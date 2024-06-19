const Posts = require("../model/postsModel");
const Media = require('../model/mediaModel');
const Comments = require('../model/CommentsModel');
const Likes = require('../model/likesModel');
const Follows = require('../model/followsModel');
const CheckBan = require("../model/checkBanModel");
const fs = require('fs');
const cloudinary = require('cloudinary');
const { default: mongoose } = require("mongoose");
const { findByIdAndDelete } = require("../model/usersModel");

const removeTemp = (path) => {
    fs.unlink(path , err => {
        if(err) {
            throw err
        }
    })
}

const postCtrl = {
    addPost: async (req, res ) => {
        try {
            const userId = req.user._id;
            const {caption, isBanned } = req.body;
            if(req.files){

                const {content} = req.files;

                const post = await Posts.create({userId, caption ,isBanned })

                let contentType = content.mimetype.split("/")[0];

                if(contentType == "image" || contentType == "png" || contentType == "img"){
            
                    const result = await cloudinary.v2.uploader.upload(content.tempFilePath, {folder: 'InstagramClone'}, async  (err, result) => {
                        if(err){
                            throw err
                        }
                        removeTemp(content.tempFilePath)
                        return result
                    })
                    contentType = "image"
                    const media = await Media.create({postId: post._id , mediaType: contentType , url: result.url , publicId : result.public_id })
                    return res.status(201).send({message: 'Created Image', media , post })
                }

                if(contentType == "video" || contentType == "mp4"){

                    const result = await cloudinary.v2.uploader.upload(content.tempFilePath, { resource_type: "video", folder: 'InstagramClone'}, async  (err, result) => {
                        if(err){
                            throw err
                        }
                         removeTemp(content.tempFilePath)
                        return result
                    })
                    contentType = "video"
                    const media = await Media.create({postId: post._id , mediaType: contentType , url: result.url , publicId : result.public_id })
                    return res.status(201).send({message: 'Created Video', media , post })
                }
                
            }else{
                return res.status(400).send({message: "Please send your Post"})
            }

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    deletePost: async (req , res ) => {
        try {
            const {id} = req.params;

            const post = await  Posts.findById(id);

            if(!post) {
                return res.status(404).send({message: "Not found"})
            }
            if(!req.user.isAdmin && req.user._id !== post.userId ){
                return res.status(405).send({message: 'Not allowed'})
            }

            await Likes.deleteMany({postId : id})
            await Comments.deleteMany({postId : id});
            const media = await Media.findOneAndDelete({postId : id});
            let {publicId} = media;

            if(media.mediaType == "image"){
                await cloudinary.v2.uploader.destroy(publicId, async (err) => {
                    if(err){
                        throw err
                    }
                })
            }else if(media.mediaType == "video"){
                await cloudinary.v2.uploader.destroy(publicId, { resource_type: 'video' } , async (err) => {
                    if(err){
                        throw err
                    }
                })
            }
            
            await Posts.findByIdAndDelete(id);
            return res.status(200).send({message: "Deleted", post})

            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },

    getPosts : async (req, res ) => {
        try {
            const posts = await Posts.aggregate([
                {$lookup : {from: 'media' , let : {postId: "$_id"},
                pipeline: [
                    {$match: {$expr : {$eq :["$postId" , "$$postId"]}}}
                ],
                as: 'media'}},
                {
                    $lookup : {from: 'likes', let : {postId :"$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$postId", "$$postId"]}}}
                    ],
                    as: "likes"
                }}
            ])
            
            

            return res.status(200).send({posts})
            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getOnePost :async (req, res ) => {
        try {
            const {id} = req.params;

            const post = await Posts.aggregate([
                {$match: {_id: new mongoose.Types.ObjectId(id)}},
                {$lookup : {from: 'media' , let : {postId: "$_id"},
                pipeline: [
                    {$match: {$expr : {$eq :["$postId" , "$$postId"]}}}
                ],
                as: 'media'}},
                {
                    $lookup : {from: 'likes', let : {postId :"$_id"},
                    pipeline: [
                        {$match: {$expr: {$eq: ["$postId", "$$postId"]}}}
                    ],
                    as: "likes"
                }},
                {
                    $lookup : {from : 'comments' , let : {postId: "$_id"},
                    pipeline: [
                        {$match : {$expr : {$eq : ["$postId" , "$$postId"]}}}
                    ],
                    as: "comments"
                
                }}
            ])
            return res.status(200).send({message: post})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    updatePost : async (req, res ) =>{
        try {
            const {caption} = req.body;
            const {id} = req.params;
            
            const oldPost =  await Posts.findById(id);

            if(!oldPost) {
                return res.status(404).send({message: "not found"});
            };

            if(!req.user.isAdmin && req.user._id !== oldPost.userId){
                return res.status(405).send({message: "not allowed"})
            }

            const post = await Posts.findByIdAndUpdate(id, {caption}, {new: true});

            return res.status(200).send({message: "Updated", post})

            
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getVideos: async (req, res) => {
        try {
            // let medias = await Media.find({mediaType: "video"});
            const posts  = await Posts.aggregate([
                {
                    $lookup : {from : 'media' , let : {postId: "$_id"},
                    pipeline: [
                        {$match : {$expr : {$eq : ["$postId" , "$$postId"], $eq: ["$mediaType" , "video"]}}}
                    ],
                    as: "media"
                }}
            ])
            return res.status(200).send({message: "Get videos", posts}) 
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getFollowedPosts: async (req, res) => {
        try {
            const userId = req.user._id;
            let followeds  = await Follows.find({followerId: userId});
            console.log(followeds);
            const posts = await Posts.aggregate([
                {
                    $match: {userId : { $in: followeds.map(followed => followed.followedId) }}
                },
                {
                    $lookup : {from : 'media' , let : {postId: "$_id"},
                    pipeline: [
                        {$match : {$expr : {$eq : ["$postId" , "$$postId"]}}}
                    ],
                    as: "media"
                }}
            ])
            
            return res.status(200).send({message: "Get Posts from my followed", posts})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    banPost: async (req, res ) => {
        try {
            const {id} = req.params;
            
            if(!req.user.isAdmin){
                return res.status(405).send({message: "Not allowed"})
            }

            const post = await Posts.findByIdAndUpdate(id , {isBanned: true} , {new: true});

            if(!post) {
                return res.status(404).send({message: "Not found"})
            }
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    checkBan: async (req, res) => {
        try {
            const {id} = req.params;
            const {banText } = req.body;

            const newRequest = await CheckBan.create({postId: id , banText})

            return res.status(201).send({messsage: "New Spam" , newRequest})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = postCtrl