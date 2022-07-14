import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./api/user.route.js";
import assets from "./api/assets.route.js";
import trial from "./api/trial.route.js";
import cors from "cors";
import {UserModel} from "./model/UserModel.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    exposedHeaders: ["Content-Disposition"]
}));
app.use(express.json({limit: '50mb'}));
app.use("/api/v1/user", user)
app.use("/api/v1/trial", trial)
app.use("/assets", assets)
app.use("/api/*",(req, res) => {
    res.status(404).json({
        status: "error",
        message: "Not found"
    })
})

mongoose.connect(process.env.LOCAL_DATABASE_URI).then(async () => {
    console.log("Database connected");

    const admin = await UserModel.count().catch(err => {
        console.log(err);
    })

    if(admin === 0) {
        const admin = new UserModel({
            username: process.env.USERNAME_ADMIN,
            password: process.env.PASSWORD_ADMIN,
            role: "admin",
            accessToken: '',
        })
        await admin.save().then(() => {console.log("Admin Created")}).catch(err => {
            console.log(err);
        })
    }

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
})