const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleGetRecivedRequest } = require("../controller/user");

const userRoute = express.Router();

userRoute.get("/requests/recived", userAuth, handleGetRecivedRequest)

module.exports = userRoute;