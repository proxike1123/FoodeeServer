//define Router path

var express = require("express");
var userController = require("../controller/user-controller");
var router = express.Router();

//mobile user login routes
router.post("/login", userController.userLogin);

// curd form route
router.get("/", userController.UserForm);
// create data route
router.post("/create", userController.createUser);
// display data route
router.get("/fetch", userController.fetchUser);
// edit data route
router.get("/edit/:id", userController.editUser);
// update data route
router.post("/edit/:id", userController.UpdateUser);
// delete data route
router.get("/delete/:id", userController.deleteUser);

module.exports = router;
