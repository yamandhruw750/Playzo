import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/createUser").post(createUser)
// router.route('/login', )

export default router;