const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleViewProfile, handleEditProfile } = require("../controller/profile");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, handleViewProfile)
profileRouter.patch("/edit", userAuth, handleEditProfile)

module.exports = profileRouter;