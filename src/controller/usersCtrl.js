const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Users = require("../model/usersModel")

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const userCtrl = {
    SignUp: async (req,res) => {
        const {email,userName} = req.body
        try {
            const users = await Users.findOne({email})

            const username = await Users.findOne({userName})

            if(users){
                return res.status(400).json({message: "Bu emailli foydalanuvchi mavjud!"})
            }

            if(userName){
                return res.status(400).json({message: "Bu nomli foydalanuvchi mavjud!"})
            }
            const paswordhash = await bcrypt.hash(req.body.password,10)

            req.body.password = paswordhash

            const user = new Users(req.body)

            await user.save()

            delete user._doc.password

            const token = JWT.sign(user._doc, JWT_SECRET_KEY)

            return res.status(201).send({message:"Created user",user,token})
            
        } catch (error) {
            res.status(503).send({message: error.message})

        }
    },
    Login: async (req,res) => {
        try {
            const {email,password}= req.body
            
            const user = await Users.findOne({email})

            if(!user){
                return res.status(404).json({message: "Email yoki parol notogri"})
            }

            const verifiy = await bcrypt.compare(password,user.password)

            
            if(!verifiy){
                return res.status(400).json({massage: "Email yoki parol notogri"})
            }
   
            delete user._doc.password
            const token = JWT.sign(user._doc, JWT_SECRET_KEY,{expiresIn:'2h'})

            return res.status(201).send({massage: "Login Success" , user, token})

        } catch (error) {
            res.status(503).send({message: error.message})
        }
    },
    getAllUsers: async (req,res) => {
        try {
            let user = await Users.find()
            if(!user){
                return res.status(400).json({massage: "Users not found"})
            }
            user = user.map(users => {
                const {password,...otherDetails}= users._doc
                return otherDetails
            })

            return res.status(200).send({message:'All Users',user})
        } catch (error) {
            res.status(503).send({message: error.message})
            
        }
    },
    updateUser: async (req,res) => {
        try {
            const {id}= req.params
            if(id === req.user._id|| req.isAdmin){
                const user = await Users.findById(id)

                if(!user){
                    return  res.status(404).json({massage:'User not found'})
                }

                if(req.body.password && req.body.password != ""){
                    const hashedPass = await bcrypt.hash(req.body.password,10)
                    req.body.password = hashedPass
                }else{
                    delete req.body.password
                }

                const updateUser =await Users.findByIdAndUpdate(id,req.body,{new:true})

                return res.status(200).json({massage:"User update seccessfully",user:updateUser})
                
            }

        } catch (error) {
            res.status(503).send({message: error.message})
        }

    },
    deleteUser: async (req,res) => {
        try {
            const {id} = req.params
            if(id === req.user._id|| req.isAdmin){
                const user = await Users.findById(id)

                if(!user){
                    return res.status(404).json({massage:'User not found'})
                }

                if(req.isAdmin){
                    const deleteUser = await Users.findByIdAndDelete(id)

                   return res.status(200).send({message:'deleted user succesfuly'})
                }
                const deleteUser = await Users.findByIdAndDelete(id)

                return res.status(200).send({message:'deleted user succesfuly',deleteUser})
            }
        } catch (error) {
            res.status(503).send({message: error.message})
        }
    },
    getUser: async (req,res) => {
        try {
            const {id} = req.params

            const user = await Users.findById(id)

            if(!user){
                return res.status(404).json({massage:'User not found'})
            }
            
            delete user._doc.password

           return res.status(200).send({message:"User",user})
        } catch (error) {
            res.status(503).send({message: error.message})
        }
    },
    searchUsers: async (req,res) => {
        try {
            const {text}=req.query

            const key = new RegExp(text,"i")
    
            const search = await Users.find({
                $or: [{userName: { $regex: key}}]
            })
            if(!search){
                return res.status(404).send({message:`${text} sorovingiz boyicha hch km topilmadi`,search})

            }
    
            return res.status(200).send({message:`${text}boyicha qdruv natijasi`,search})
        } catch (error) {
            res.status(503).send({message: error.message})
        }
    }

}
module.exports = userCtrl