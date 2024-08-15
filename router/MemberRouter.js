import express from "express";
import * as controller from "../controller/MemberController.js";

const router = express.Router();

router.post("/signUp", controller.signUp);
router.post("/login", controller.login);

export default router;
