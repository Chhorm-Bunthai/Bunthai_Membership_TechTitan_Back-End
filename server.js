const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });
const app = express();

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Connect to our DB
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(err);
  });

// Server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
