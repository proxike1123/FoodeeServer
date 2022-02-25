//define Router path

var express = require("express");
var userController = require("../controller/user-controller");
var router = express.Router();

//mobile user login routes
router.post("/login", userController.userLogin);
router.post("/register", userController.userRegister);

module.exports = router;
