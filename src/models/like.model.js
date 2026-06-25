import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.pre("validate", function () {
  const likedTargets = [this.comment, this.video, this.tweet].filter(Boolean);

  if (likedTargets.length !== 1) {
    this.invalidate("like", "Like must belong to exactly one target");
  }
});

likeSchema.index(
  { comment: 1, likedBy: 1 },
  {
    unique: true,
    partialFilterExpression: { comment: { $exists: true } },
  }
);
likeSchema.index(
  { video: 1, likedBy: 1 },
  {
    unique: true,
    partialFilterExpression: { video: { $exists: true } },
  }
);
likeSchema.index(
  { tweet: 1, likedBy: 1 },
  {
    unique: true,
    partialFilterExpression: { tweet: { $exists: true } },
  }
);

export const Like = model("Like", likeSchema);
