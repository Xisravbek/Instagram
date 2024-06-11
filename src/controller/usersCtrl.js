const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Users = require("../model/usersModel")

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const userCtrl = {
    SignUp: async (req,res) => {
        const {email} = req.body
        try {
            const Useritekshr = await Users.findOne({email})

            if(Useritekshr){
                return res.status(400).json({message: "Bu emailli foydalanuvchi mavjud!"})
            }

            const paswordhash = await bcrypt.hash(req.body.password,10)

            req.body.password = paswordhash

            const user = new Users(req.body)

            await user.save()

            delete user._doc.password

            const token = JWT.sign(user._doc, JWT_SECRET_KEY,{expiresIn:'5h'})

            res.status(201).send({message:"Created user",user,token})
            
        } catch (error) {
            res.status(503).send({message: error.message})

        }
    }
}
module.exports = userCtrl