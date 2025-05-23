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

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
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
