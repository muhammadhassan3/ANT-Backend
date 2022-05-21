import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./api/user.route.js";
import assets from "./api/assets.route.js";
import trial from "./api/trial.route.js";
import cors from "cors";

dotenv.config();
const port = 81;
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

mongoose.connect(process.env.DATABASE_URI).then(() => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}).catch((err) => {
    console.log(err);
})