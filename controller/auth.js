const userModel = require("../model/user");
const userSchemaZod = require("../utils/validation")

async function handleUserSignUp(req, res) {
    try {
        const validatatedData = userSchemaZod.parse(req.body);
        if (validatatedData) {
            const user = new userModel(validatatedData);
            const savedUser = await user.save();
            res.status(200).json(
                savedUser
            )
        }
    } catch (error) {
        res.status(400).json({
            message: `Something went wrong! ${error}`
        })
    }
}

module.exports = {
    handleUserSignUp
}