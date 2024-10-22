const ConnectionRequestModel = require("../model/connectionRequest");
const { aggregate } = require("../model/user");

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

module.exports = {
    handleGetRecivedRequest
}