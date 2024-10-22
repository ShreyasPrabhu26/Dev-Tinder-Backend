const ConnectionRequestModel = require("../model/connectionRequest");
const userModel = require("../model/user");
const { allowedRequestStatus, allowedRequestReviewStatus } = require("../utils/validation")

async function handleStatusRequest(req, res) {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await userModel.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingConnectionRequest) {
            return res
                .status(400)
                .send({ message: "Connection Request Already Exists!!" });
        }

        const allowedStatus = allowedRequestStatus.parse(status);
        const connectionRequest = new ConnectionRequestModel(
            { fromUserId, toUserId, status: allowedStatus }
        );

        const connectionData = await connectionRequest.save();

        res.status(200)
            .json({
                message:
                    req.user.firstName + " is " + status + " in " + toUser.firstName,
                connectionData,
            });

    } catch (error) {
        res.status(500).json({
            error: `Something went wrong. ${error}`,
        });
    }
}

async function handleReviewRequest(req, res) {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = allowedRequestReviewStatus.parse(status);
        if (allowedStatus) {
            const connectionRequest = await ConnectionRequestModel.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "intrested",
            });

            if (!connectionRequest) {
                return res
                    .status(404)
                    .json({ message: "Connection request not found" });
            }

            connectionRequest.status = status;

            const data = await connectionRequest.save();

            res.json({ message: "Connection request " + status, data });
        }
    } catch (err) {
        res.status(400).send("Opps Something went wrong!: " + err.message);
    }
}

module.exports = {
    handleStatusRequest,
    handleReviewRequest
}