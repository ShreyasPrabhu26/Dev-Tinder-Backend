const mongoose = require("mongoose");
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


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
