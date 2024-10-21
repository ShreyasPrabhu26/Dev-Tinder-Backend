const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();
const { handleStatusRequest } = require("../controller/request")

requestRouter.post("/send/:status/:toUserId",
    userAuth,
    handleStatusRequest)

module.exports = requestRouter;