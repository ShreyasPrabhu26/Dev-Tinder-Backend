const ConnectionRequestModel = require("../model/connectionRequest");

async function handleGetRecivedRequest(req, res) {
    try {
        const userId = req.user._id;

        const recivedRequests = await ConnectionRequestModel.find({
            toUserId: userId,
            status: "intrested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "about", "skills"])

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
            .populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "about", "skills"])
            .populate("toUserId", ["firstName", "lastName", "photoUrl", "gender", "about", "skills"]);

        if (!connectionRequests || connectionRequests.length === 0) {
            return res.status(404).send("No connections found.");
        }

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({ data });

    } catch (error) {
        res.status(400).send("Oops! Something went wrong: " + error.message);
    }
}

module.exports = {
    handleGetRecivedRequest,
    handleGetConnections
}