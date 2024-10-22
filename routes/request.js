const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleStatusRequest, handleReviewRequest } = require("../controller/request")

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId",
    userAuth,
    handleStatusRequest)

requestRouter.post("/review/:status/:requestId",
    userAuth,
    handleReviewRequest
)

module.exports = requestRouter;