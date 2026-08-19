import { Video } from "../models/video.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const createVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const videoFile = req.files?.videoFile?.[0];
  const thumbnail = req.files?.thumbnail?.[0];

  const owner = req.user._id;

  //Validate the title and Description
  if (!title?.trim()) {
    throw new ApiError(400, "Video title is required");
  }
  if (!description?.trim()) {
    throw new ApiError(400, "Video description is required");
  }

  //Enforce Character limit
  if (title.trim().length > 200) {
    throw new ApiError(400, "Video title cannot exceed 200 characters");
  }
  if (description.trim().length > 5000) {
    throw new ApiError(400, "Video description cannot exceed 5000");
  }

  //Validate the videoFile and Thumbnail
  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail is required");
  }

  //Upload videoFile and validate it
  const videoUpload = await uploadOnCloudinary(videoFile.path, "video");

  if (!videoUpload) {
    throw new ApiError(500, "Failed to upload video");
  }

  //Upload thumbnail and validate it
  const thumbnailUpload = await uploadOnCloudinary(thumbnail.path, "image");

  if (!thumbnailUpload) {
    await deleteFromCloudinary(videoUpload.public_id, "video");
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  try {
    const video = await Video.create({
      videoFile: videoUpload.secure_url,
      thumbnail: thumbnailUpload.secure_url,
      title: title.trim(),
      description: description.trim(),
      duration: videoUpload.duration,
      owner: req.user._id,
      isPublished: false,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, video, "Video created successfully"));
  } catch (error) {
    await deleteFromCloudinary(videoUpload.public_id, "video");

    await deleteFromCloudinary(thumbnailUpload.public_id, "image");
    throw error;
  }
});
