const express = require('express');
const { handleUserSignUp, handleUserLogin, handleUserLogout } = require('../controller/auth');
const authRouter = express.Router();

authRouter.post("/signup", handleUserSignUp);
authRouter.post("/login", handleUserLogin);
authRouter.post("/logout", handleUserLogout)

module.exports = authRouter;