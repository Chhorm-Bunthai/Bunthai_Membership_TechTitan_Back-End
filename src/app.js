const express = require("express");
const helmet = require("helmet");
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Secure HTTP headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.CLIENT_URL,
  // origin: "*",
  methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
  credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
