const express = require('express');
const { handleUserSignUp } = require('../controller/user');
const userRouter = express.Router();

userRouter.post("/signup", handleUserSignUp);

module.exports = userRouter;