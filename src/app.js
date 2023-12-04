const express = require("express");
const AppError = require("./utils/appError");

const app = express();

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
