const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://komalgarg8952:Trigger123@cluster0.1ajbkzy.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = connectDB;
