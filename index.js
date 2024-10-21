const express = require("express");
const connectToDatabase = require("./config/connection");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

const app = express();

//Environment Configuration
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json())
app.use(cookieParser());

//Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter)

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