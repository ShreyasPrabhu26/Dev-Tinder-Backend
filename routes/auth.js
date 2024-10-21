const express = require('express');
const { handleUserSignUp } = require('../controller/auth');
const authRouter = express.Router();

authRouter.post("/signup", handleUserSignUp);

module.exports = authRouter;