import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

//Subscribe to Channel

const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invaild channel ID");
  }

  if (req.user._id.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const channelExists = await User.exists({
    _id: channelId,
  });

  if (!channelExists) {
    throw new ApiError(404, "channel not found");
  }

  try {
    const subscription = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, subscription, "Successfully subscribed to channel")
      );
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(409, "Already subscribed to this channel");
    }
    throw error;
  }
});

//Unscribe From Channel
const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const channelExists = await User.exists({
    _id: channelId,
  });

  if (!channelExists) {
    throw new ApiError(404, "channel not found");
  }

  const subscription = await Subscription.findOneAndDelete({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (!subscription) {
    throw new ApiError(404, "You are not subscribed to this channel");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully unsubscribed from channel"));
});

//Get Subscriber count
const getChannelSubscriberCount = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invaild channel ID");
  }

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriberCount },
        "Subscriber count fetched successfully"
      )
    );
});

//Get Subscription Status
const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscription = await Subscription.exists({
    subscriber: req.user._id,
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isSubscribed: Boolean(subscription) },
        "Subsciption status fetched successfully"
      )
    );
});

//Get User Subscriptions
const getUserSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({
    subscriber: req.user._id,
  })
    .populate("channel", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriptions,
        "User subscriptions fetched successfully"
      )
    );
});

export {
  subscribeToChannel,
  unsubscribeFromChannel,
  getChannelSubscriberCount,
  getSubscriptionStatus,
  getUserSubscriptions,
};
