import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/milter.middleware.js";

const router = Router();

router.route("/createUser").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    { name: "coverImage", maxCount: 1 },
  ]),
  createUser
);
// router.route('/login', )

export default router;
