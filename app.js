const express = require("express");

const userroute = require("./routes/userroutes");
const AppError = require("./utils/apperror");
const globalErrorHandler = require("./controllers/errorcontroller");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("home page");
});
app.use("/user", userroute);

app.all("*", (req, res, next) => {
  next(new AppError(`cam't find ${req.originalUrl} on the server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
