import express from "express";
import * as controller from "../controller/ServiceController.js";

const router = express.Router();

router.post("/serviceApply", controller.serviceApply);

export default router;
