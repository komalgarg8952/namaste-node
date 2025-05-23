const mongoose = require('mongoose');

const messageSchmea = new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

const chatSchmea = new mongoose.Schema({
    participants:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
    ],
    messages: [messageSchmea]

})

module.exports = new mongoose.model('chatModel',chatSchmea)