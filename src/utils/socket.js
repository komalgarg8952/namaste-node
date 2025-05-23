const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetId].sort().join("$"))
    .digest("hex");
};
let whitelist = ['http://localhost:5173', 'http://13.61.4.123']

let  corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
const initalizeSocket = (server) => {
  const io = socket(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetId }) => {
      const roomId = getSecretRoomId(userId, targetId);
      console.log(firstName + " joined Room" + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ firstName, userId, targetId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetId);
        console.log(
          firstName + " is in Room" + roomId + " sending message is " + text
        );
        let chat = await Chat.findOne({
          participants: {
            $all: [userId, targetId],
          },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetId],
            messages: [],
          });
        }
        chat.messages.push({
          text,
          senderId: userId,
        });
        await chat.save();

        io.to(roomId).emit("messageReceived", { firstName, text });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initalizeSocket;
