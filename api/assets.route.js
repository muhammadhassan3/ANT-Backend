import express from 'express';
import AssetsController from '../controller/assets.controller.js';

const app = express();

app.route("/arrow/:fileName").get(AssetsController.getArrowImage);
app.route("/fish/:fileName").get(AssetsController.getFishImage);
app.route("/sound/:fileName").get(AssetsController.getSound);

export default app;