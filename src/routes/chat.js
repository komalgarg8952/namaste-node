const express = require('express');

const {userAuth} = require('../middleware/userAuth');
const Chat = require('../models/chat');
const chatRouter = express.Router();

chatRouter.get('/chat/:targetId',userAuth,async(req,res)=>{
    try{
        console.log("comes here")
        const userId = req.user._id;
        const {targetId} = req.params;
        let chat = await Chat.findOne({
            participants:{
                $all:[userId, targetId]
            }
        }).populate({
            path: 'messages.senderId',
            select: 'firstName lastName'
        });

        if(!chat){
            chat = new Chat({
                participants:[userId,targetId],
                messages:[]
            })

            await chat.save();
        }


        res.json(chat)
    }catch(err){
        console.log(err)
    }
})



module.exports = chatRouter;
