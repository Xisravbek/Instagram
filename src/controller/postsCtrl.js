const Posts = require("../model/postsModel");
const Media = require('../model/mediaModel')
const fs = require('fs');
const cloudinary = require('cloudinary')

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
                    const media = await Media.create({postId: post._id , mediaType: contentType , url: result.url })
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
                    const media = await Media.create({postId: post._id , mediaType: contentType , url: result.url })
                    return res.status(201).send({message: 'Created Video', media , post })
                }
                
            }else{
                return res.status(400).send({message: "Please send your Post"})
            }

        } catch (error) {
            
        }
    }
}

module.exports = postCtrl