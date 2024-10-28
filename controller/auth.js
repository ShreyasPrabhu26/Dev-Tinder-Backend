const userModel = require("../model/user");
const { userSchemaZod } = require("../utils/validation")
const bcrypt = require("bcrypt");

async function handleUserSignUp(req, res) {
    try {
        const validatatedData = userSchemaZod.parse(req.body);
        if (validatatedData) {
            // Encrypt the password
            const passwordHash = await bcrypt.hash(validatatedData.password, 10);
            validatatedData.password = passwordHash;

            const user = new userModel(validatatedData);
            const savedUser = await user.save();

            const token = await savedUser.getJWT();
            res.cookie("token", token, {
                // Expires in 8hr
                expires: new Date(Date.now() + 8 * 3600000),
            });

            res.status(200).json(
                savedUser
            )
        }
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                message: `Email is Already Taken`
            })
        } else {
            return res.status(400).json({
                message: `Something went wrong! ${error}`
            })
        }
    }
}


async function handleUserLogin(req, res) {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            throw new Error("Provide Proper Credentials")
        }

        const user = await userModel.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = user.getJWT();
            res.cookie("token", token, {
                // Expires in 8hr
                expires: new Date(Date.now() + 8 * 3600000),
            });

            res.status(200).json(user);
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).json({
            message: `Something went wrong! ${error}`
        })
    }
}

async function handleUserLogout(req, res) {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.status(200)
        .send("Logout Successful!!");
}

module.exports = {
    handleUserSignUp,
    handleUserLogin,
    handleUserLogout
}