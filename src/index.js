// require("dotenv").config({ path: "./.env" });
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT;


connectDB()
  .then(() => {
    app.listen(port || 3000, () => {
      console.log(`Server is running at port ${port}`);
    });
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!", err);
  });

/*
First Approch

import express from "express";
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR:", error);
    throw error;
  }
})();*/
