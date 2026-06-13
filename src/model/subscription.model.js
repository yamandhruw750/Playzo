import { Schema, Types, model } from "mongoose";

const subscriptionSchema = new Schema({
  subscription: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Subscription = model("Subcription", subscriptionSchema);
