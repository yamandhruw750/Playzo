import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/milter.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

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
router.route("/login").post(loginUser);

//Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
