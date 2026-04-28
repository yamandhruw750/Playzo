import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = res.body;

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne({
    //This finds the email or username which is in db and match will give true or false
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      `User with this ${email} and ${username} already exist`
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if(!createdUser){
    throw new ApiError(500, "Something went wrong when registering a user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully !!")
  )
});

export { createUser };
