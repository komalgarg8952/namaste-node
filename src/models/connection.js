const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
   
    status:{
        type:String,
        enum:{
            values: ['ignored','interested','accept','reject'],
            message :'status {VALUE} is not supported'
        }

    }
},{
   timestamps:true 
})

//compound index --read about it.
connectionRequestSchema.index({fromUserId:1,toUserId:1})
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('cannot send connection request to yourself')
    }

    next();

})

module.exports = new mongoose.model('ConnectionRequest',connectionRequestSchema)