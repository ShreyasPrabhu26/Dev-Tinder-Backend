const express = require('express');
const { handleUserSignUp, handleUserLogin } = require('../controller/auth');
const authRouter = express.Router();

authRouter.post("/signup", handleUserSignUp);
authRouter.post("/login", handleUserLogin);

module.exports = authRouter;