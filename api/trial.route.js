import express from "express";
import TrialController from "../controller/trial.controller.js";

const app = express.Router();

app.route("/").get(TrialController.getTaskList);
app.route('/save').post(TrialController.saveTrial);
app.route('/:id/result').get(TrialController.getTrialResult);
app.route('/:id/result/download').get(TrialController.downloadTrialRecord);

export default app;