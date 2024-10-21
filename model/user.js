const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { defaultUserProfilePhoto } = require("../utils/constants");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 10,
        },
        lastName: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 10,
        },
        emailId: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            min: 18,
            max: 100,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        photoUrl: {
            type: String,
            default: defaultUserProfilePhoto
        },
        about: {
            type: String,
        },
        skills: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.getJWT = function () {
    const user = this;

    const token = jwt.sign({ _id: user._id },
        process.env.JWT_SECRET, {
        expiresIn: "2d",
    });

    return token;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
