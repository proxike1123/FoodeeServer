//define Router path

var express = require("express");
var adminController = require("../controller/admin-controller");
var router = express.Router();

//mobile user login routes
router.post("/login", adminController.adminLogin);

module.exports = router;
