const userSchemaZod = require("../utils/validation")

function handleUserSignUp(req, res) {
    const validatatedData = userSchemaZod.parse(req.body);
    if (!validatatedData) {
        console.log("issue in data");
    } else {
        console.log("dATA:", validatatedData);
    }
}

module.exports = {
    handleUserSignUp
}