import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken
} from "../controllers/user.controller.js";
import { upload } from "../middleware/milter.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
//Create Route
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
//Login Route
router.route("/login").post(loginUser);

//Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

export default router;
