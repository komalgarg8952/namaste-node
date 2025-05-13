const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middleware/userAuth')
const {validateUpdatedField} = require('../utils/validations')

profileRouter.get("/profile/view",userAuth, async (req, res) => {
  try {  
    const {user} = req;

    res.send(user);   
  } catch (err) {
    res.status(400).send("some error occured" + err.message);
  }
});

profileRouter.patch('/profile/edit',userAuth,async(req,res,next)=>{
    try{
        const {user} = req;
       const updateAllowed = validateUpdatedField(req);
       console.log(updateAllowed)
        if(!updateAllowed){
            throw new Error('update is not allowed');
        }
        const updatedBody = Object.keys(req.body).forEach(key=>user[key]=req.body[key]);
        await user.save();
        res.json({
            message:'update is successfully',
            data:user
        })

    }catch (err) {
    res.status(400).send("some error occured" + err.message);
  }

})


module.exports = profileRouter