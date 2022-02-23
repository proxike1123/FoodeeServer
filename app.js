//Create HTTP errors for Express
var createError = require("http-errors");

var { spawn } = require("child_process");

//Node web framework
var express = require("express");

var router = express.Router();

//Path module provides a lot of very useful functionality to access and interact with the file system
var path = require("path");

//Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
var cookieParser = require("cookie-parser");

//HTTP request logger middleware for node.js
var logger = require("morgan");

const cors = require("cors");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user-route");
var adminRouter = require("./routes/admin-route");
var shopRouter = require("./routes/shop-route");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Log dev
app.use(logger("dev"));

//built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

//a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//To serve static files such as images, CSS files, and JavaScript files,
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/shop", shopRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
