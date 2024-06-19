const { default: mongoose } = require('mongoose');
const Chat = require('../model/chatModel');
const Messages = require('../model/messageModel');
const cloudinary = require('cloudinary');

const chatCtrl = {
    addChat: async (req , res ) => {
        try {
            const firstId = req.user._id;
            const secondId = req.params.id;

            const oldChat = await Chat.findOne({users: [firstId , secondId]});

            if(oldChat){
                // const messages = await Messages.find({chatId: oldChat._id});
                const chat = await Chat.aggregate([
                    {$match: {_id :  new mongoose.Types.ObjectId(oldChat._id)}},
                    {$lookup : {from: 'messages' , let : {chatId: "$_id"},
                    pipeline: [
                        {$match: {$expr : {$eq :["$chatId" , "$$chatId"]}}}
                    ],
                    as: 'messages'}},
                ])

                return res.status(200).send({message: "Got", chat: chat[0] })
            }else{
                const newChat = await Chat.create({users: [firstId ,secondId]});
                return res.status(201).send({message: "created", chat:newChat})
            }
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    },
    getAllChats: async (req, res) => {
        try {
            const userId = req.user._id;
            const chats = await Chat.find({users: { $in: [userId] }});
            return res.status(200).send({message: "get chats", chats})
        } catch (error) {
            return res.status(503).send({message: error.message}) 
        }
    },

    deleteChat : async (req, res) => {
        try {
            const {id} = req.params;

            const chat = await Chat.findById(id);

            if(!chat) {
                return res.status(404).send({message: "Not found"})
            }

            const messages = await Messages.find({chatId: id});
            for (const message of messages) {
                if(message.mediaType == "image"){
                    await cloudinary.v2.uploader.destroy(message.publicId, async (err) => {
                        if(err) {
                            throw err
                        }
                    })
                }else if(message.mediaType == "video"){
                    await cloudinary.v2.uploader.destroy(message.publicId , { resource_type: 'video' }, async (err) => {
                        if(err) {
                            throw err
                        }
                    })
                }
            }

            await Messages.deleteMany({chatId :id});

            const oldChat = Chat.findByIdAndDelete(id);
            return res.status(200).send({message: "Chat was Deleted" , chat})
        } catch (error) {
            return res.status(503).send({message: error.message})
        }
    }
}

module.exports = chatCtrl