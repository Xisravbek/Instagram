const Messages = require("../model/messageModel");
const Chat = require('../model/chatModel');
const fs = require('fs');
const cloudinary = require('cloudinary');

const removeTemp = (path) => {
    fs.unlink(path , err => {
        if(err) {
            throw err
        }
    })
}

const messagesCtrl = {
    addMessage: async (req, res ) => {
        try {
            const {chatId , content } = req.body;
            const senderId = req.user._id;
           

            if(!content && !req.files){
                return res.status(400).send({message: "Please send something"})
            }

            if(req.files){
                const {file} = req.files;
                let contentType = file.mimetype.split("/")[0];
                console.log(contentType);
                if(contentType == "image" || contentType == "png" || contentType == "img"){
            
                    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {folder: 'InstagramClone'},   (err, result) => {
                        if(err){
                            return console.log(err);
                        }
                        removeTemp(file.tempFilePath)
                        return result
                    })
                    contentType = "image"
                    
                    const message = await Messages.create({
                        chatId,
                        senderId,
                        content,
                        url: result.url,
                        mediaType: contentType,
                        publicId: result.public_id
                    })
                    return res.status(201).send({message: 'Created message Image', message })
                }

                if(contentType == "video" || contentType == "mp4"){

                    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, { resource_type: "video", folder: 'InstagramClone'},   (err, result) => {
                        if(err){
                            throw err
                        }
                         removeTemp(file.tempFilePath)
                        return result
                    })
                    contentType = "video"
                    const message = await Messages.create({
                        chatId,
                        senderId,
                        content,
                        url: result.url,
                        mediaType: contentType,
                        publicId: result.public_id
                    })
                    return res.status(201).send({message: 'Created message Video', message })
                }
            }else{
                const message = await Messages.create({
                    chatId,
                    senderId,
                    content
                })
                return res.status(201).send({message: "created Message", message })
            }

        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = messagesCtrl