import { Router } from "express";

import {
  getChannelSubscriberCount,
  getSubscriptionStatus,
  getUserSubscriptions,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "../controllers/subscription.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/:channelId")
  .post(subscribeToChannel)
  .delete(unsubscribeFromChannel);

router.route("/my-subscriptions").get(getUserSubscriptions);

router.route("/:channelId/count").get(getChannelSubscriberCount);
router.route("/:channelId/status").get(getSubscriptionStatus);

export default router;
