import { Router } from "express";

import { createVideo } from "../controllers/video.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post(
  "/",
  verifyJWT,
  upload.fields(
    [
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ],
    createVideo
  )
);

export default router;
