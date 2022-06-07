import express from "express";
import UserController from "../controller/user.controller.js";
import InstructionController from "../controller/instruction.controller.js";

const app = express.Router();

app.route("/save").post(UserController.apiSaveUser);
app.route("/all").get(UserController.apiGetAllUsers);
app.route("/instructions").get(InstructionController.getMessage)

app.route("/admin/login").post(UserController.login);
export default app