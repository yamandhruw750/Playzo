import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createUser = asyncHandler(async (req, res) => {
  //Get user details from frontend
  const { fullName, email, username, password } = req.body;

  // Validation - not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //Check if user is already exists with username , email
  const existedUser = await User.findOne({
    //This finds the email or username which is in db and match will give true or false
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      `User with this ${email} and ${username} already exist`
    );
  }

  console.log(req.files);

  //Check for images and check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check avatar upload or not
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  //create user object — create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //remove password and refresh token field from response
  //findbyid search and give all the fileds but not -password -refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong when registering a user");
  }
  //return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully !!"));
});

export { createUser };
