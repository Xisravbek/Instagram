const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY  = process.env.JWT_SECRET_KEY

const authMiddlware = (req, res, next) => {
    try {
        const token = req.headers.token;
        if(!token){
            return res.status(405).send({message: "Token is required"});
        }
        const valueToken = jwt.verify(token, JWT_SECRET_KEY);
        req.user = valueToken;
        if(valueToken){
            if(valueToken.role == "admin"){
                req.user.isAdmin = true
            }else{
                req.user.isAdmin = false
            }
        }
        next()
        
    } catch (error) {
        return res.status(503).send({message: error.message})
    }
}

module.exports = authMiddlware;