const ConnectionRequestModel = require("../model/connectionRequest");
const userModel = require("../model/user");
const { FEED_LIMIT } = require("../utils/constants");

async function handleGetRecivedRequest(req, res) {
    try {
        const userId = req.user._id;

        const recivedRequests = await ConnectionRequestModel.find({
            toUserId: userId,
            status: "intrested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"])

        if (!recivedRequests) {
            return res
                .status(400)
                .send("No Request Found!");
        }
        res.status(200).json({ "data": recivedRequests });
    } catch (error) {
        res.status(400)
            .send("Opps Something went wrong" + error);
    }
}

async function handleGetConnections(req, res) {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", "firstName lastName photoUrl age gender about skills")
            .populate("toUserId", "firstName lastName photoUrl age gender about skills");


        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}



async function handleGetFeed(req, res) {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > FEED_LIMIT ? FEED_LIMIT : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId  toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await userModel.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(["firstName", "lastName", "photoUrl", "gender", "about", "age", "skills"])
            .skip(skip)
            .limit(limit);

        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    handleGetRecivedRequest,
    handleGetConnections,
    handleGetFeed
}