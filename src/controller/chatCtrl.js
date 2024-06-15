const { default: mongoose } = require('mongoose');
const Chat = require('../model/chatModel');
const Messages = require('../model/messageModel')

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
    }
}

module.exports = chatCtrl