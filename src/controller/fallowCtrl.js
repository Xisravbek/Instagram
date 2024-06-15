const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Follows = require("../model/followsModel");
const { default: mongoose } = require('mongoose');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const userCtrl = {
    falow: async (req,res) => {
      try {
        let followedId = req.params.id
        let followerId = req.user._id;

        // console.log(, followerId);

        const oldfallow = await Follows.findOneAndDelete({followedId,followerId})

        if(!oldfallow){
            const unfallow = await Follows.create({followedId,followerId})

            return res.status(200).send({message:"fallowed in succesfuly"})
        }
        // await followed.save()

        return res.status(200).send({message:"fallow in deleted"})
      } catch (error) {
        return res.status(503).send({message: error.message})
      }
    },

}
module.exports = userCtrl