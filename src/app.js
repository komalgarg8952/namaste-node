const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const initalizeSocket = require("./utils/socket");

require("dotenv").config();
const cors = require('cors')
const app = express();
const http = require("http");

const server = http.createServer(app);
initalizeSocket(server);
let whitelist = ['http://localhost:5173', 'http://13.61.4.123']

let  corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials:true
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile')
const {requestRouter} = require('./routes/request');
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");




app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter)
app.use('/',chatRouter)
//db connection
connectDB()
  .then(() => {
    console.log("connection is established successfully");
    server.listen(process.env.PORT, () => {
      console.log("server is listening to port 9090");
    });
  })
  .catch((err) => console.log("error while connecting to database", err));
