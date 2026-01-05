const jwt = require('jsonwebtoken');
require('dotenv').config();
const authentication = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (!token)
            res.status(404).send({status:false, message: "Unauthorized user" });
        const user = jwt.verify(token,process.env.JWT_SECRET);
        if (!user)
            res.status(404).send({status:false, message: "Unauthorized user" });
        req.userId = user.userId;
        next();
    }
    catch(error){
        res.status(500).send({status:false,message:"Something went wrong"+error})
    }
}

module.exports=authentication;