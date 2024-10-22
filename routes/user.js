const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleGetRecivedRequest, handleGetConnections, handleGetFeed } = require("../controller/user");

const userRoute = express.Router();

userRoute.get("/requests/recived", userAuth, handleGetRecivedRequest)
userRoute.get("/connections", userAuth, handleGetConnections)
userRoute.get("/feed", userAuth, handleGetFeed)

module.exports = userRoute;