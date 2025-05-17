const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validationFunction } = require("../utils/validations");

authRouter.post("/signup", async (req, res, next) => {
  // console.log(req.body)

  try {
    validationFunction(req);
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      sameSite:'none',
      secure:true
    });
    res.send(savedUser);
  } catch (err) {
    res.status(400).send("some error occured" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(data)
    if (!user.email) {
      throw new Error("invalid credentials");
    }
    const comparePassword = await user.validatePassword(password);

    if (!comparePassword) {
      throw new Error("invalid credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        sameSite:'none',
        secure:true
      });
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("some error occured" + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send('user is logout successfully');
});

module.exports = authRouter;
