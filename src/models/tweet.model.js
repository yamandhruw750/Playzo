import { Schema, model } from "mongoose";

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

tweetSchema.index({ owner: 1 });

export const Tweet = model("Tweet", tweetSchema);
