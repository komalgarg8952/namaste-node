const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middleware/userAuth')
const ConnectionRequest = require('../models/connection');


requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
        const {user} = req;
        const fromUserId = user._id;
        const {status,toUserId} = req.params;       
        const allowedStatus = ['ignored','interested'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:'this status'+status+'is not allowed',
                data:{}
            })
        }
        const getExistingData = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(getExistingData){
            return res.status(400).json({
                message:'connect request with existing data is not possible'
            })
        }
        const existingtoUser = await User.findById({
            _id:toUserId
        })
        if(!existingtoUser){
            return res.status(404).json({
                message:'user is not found'
            })
        }
        const connectionRequest =  new ConnectionRequest({
           fromUserId,toUserId,status 
        })
        const data  = await connectionRequest.save();
        
        res.json({
            message:`${user.firstName} is ${status} in ${existingtoUser.firstName}`,
            data
        })

    }catch(err){
        res.status(400).send("Error: " + err.message);
 
    }
})


requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try{
        const {user} = req;
        const{ status, requestId} = req.params;
        const allowedStatus = ['accept','reject'];
        if(!allowedStatus.includes(status)){
            return res.status(400).send('status is not correct')
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId: user._id,
            status:'interested'
        })
        // console.log("==comes here",connectionRequest)
        if(!connectionRequest){
            return res.status(404).send('invalid request')
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message:'request is'+status,
            data
        })

    }catch(err){
       

        res.status(400).send('ERROR:'+ err);
    }
})


module.exports ={
    requestRouter
}