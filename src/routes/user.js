const express = require("express");
const userRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connection");
const USER_SAFE_DATA = "firstName lastName gender age skills about photoUrl"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const { user } = req;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: "+ err);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const { user } = req;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: user._id, status: "accept" },
        {
          fromUserId: user._id,
          status: "accept",
        },
      ]   
    }).populate("fromUserId",USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === user._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: "+ err);
  }
});
// 1-50 || 51-100

userRouter.get('/feed',userAuth,async(req,res)=>{
    try{
        const {user} = req;
        const connectionRequest =  await ConnectionRequest.find({
            $or:[{fromUserId: user._id},{toUserId:user._id}]
        }).select("fromUserId toUserId");
        const page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 50;
        limit = limit>50?50:limit;
        const skip = (page-1)*limit;
        // console.log(req.query.page,req.query.limit)
        const hideUserFromFeed = new Set();
        connectionRequest.forEach((request)=>{
            hideUserFromFeed.add(request.fromUserId);
            hideUserFromFeed.add(request.toUserId);
        });
        const usersToShowOnFeed = await User.find({
            $and:[{ _id:{$nin:Array.from(hideUserFromFeed)}},
                {
                    _id:{$ne:user._id}
            }]
           
        }).select(USER_SAFE_DATA).limit(limit).skip(skip);
        // console.log(usersToShowOnFeed)

        res.send(usersToShowOnFeed);

    }catch(err){
        res.status(400).send("ERROR: "+err)
    }
})



module.exports = userRouter;
