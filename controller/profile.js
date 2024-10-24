const { userEditSchemaZod } = require("../utils/validation");

function handleViewProfile(req, res) {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(400).
            send("Opps Something went wrong! : " + error.message);
    }
};

async function handleEditProfile(req, res) {
    try {
        const userValidation = userEditSchemaZod.safeParse(req.body);
        if (!userValidation.success) {
            return res.status(400).json({
                message: "Data validation failed",
            });
        }
        
        const loggedInUser = req.user;

        //[PATCH] Replace existing data with saved Data
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.status(200).json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        });

    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = {
    handleViewProfile,
    handleEditProfile
}