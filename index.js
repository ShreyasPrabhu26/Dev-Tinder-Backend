const express = require("express");
const connectToDatabase = require("./config/connection");
const userRouter = require("./routes/user");
const app = express();

//Environment Configuration
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json())

//Routes
app.use("/user", userRouter);

connectToDatabase(CONNECTION_STRING)
    .then(() => {
        console.log("Connection to Database is successful!");
        app.listen(PORT, () => {
            console.log(`Server Listning on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err)
    })