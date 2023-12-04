const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception, Shutting down.");
  console.log(err.name, err.message);
  process.exit(1);
});

// Load environment variables from .env file
dotenv.config({ path: "./.env" });
const app = require("./src/app");

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
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection, shutting down server...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
