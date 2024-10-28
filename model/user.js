const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { defaultUserProfilePhoto } = require("../utils/constants");
const ConnectionRequestModel = require("./connectionRequest");

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
        deleted: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

// Cascade delete connection requests when user is deleted
userSchema.pre("remove", async function (next) {
    const user = this;
    try {
        await ConnectionRequestModel.deleteMany({
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ]
        });
        next();
    } catch (error) {
        next(error);
    }
});

// Generate JWT token
userSchema.methods.getJWT = function () {
    const user = this;

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
    });

    return token;
};

// Validate password
userSchema.methods.validatePassword = async function (inputPassword) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        inputPassword,
        passwordHash
    );

    return isPasswordValid;
}
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
