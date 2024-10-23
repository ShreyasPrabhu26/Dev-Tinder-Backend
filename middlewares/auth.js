const jwt = require("jsonwebtoken");
const userModel = require("../model/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please log in!");
        }

        // Verify the token
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedObj;

        // Fetch the user from the database
        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).send("Invalid token");
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).send("Token expired, please log in again");
        }

        res.status(400).send("Oops, something went wrong! " + err.message);
    }
};

module.exports = {
    userAuth,
};