import express from "express";
import UserController from "../controller/user.controller.js";
import InstructionController from "../controller/instruction.controller.js";

const app = express.Router();

app.route("/save").post(UserController.apiSaveUser);
app.route("/login").post(UserController.login);
app.route("/all").get(UserController.apiGetAllUsers);
app.route("/instructions").get(InstructionController.getMessage)

export default app