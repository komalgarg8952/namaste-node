const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req,res,next)=>{
   try{
    const {token} = req.cookies;
    if(!token){
       return res.status(404).send('Please Login')
    }
    const decodeData = await jwt.verify(token,"devtinderToken@");
    const userData = await User.findById({_id:decodeData._id});
    if(!userData){
        throw new Error('user is not found');
    }
    req.user = userData;
    next();

   }
   catch(err){
    res.status(400).send("error:"+ err)
   }
}

module.exports = {
    userAuth
}