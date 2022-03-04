//define Router path
var express = require("express");
var userController = require("../controller/user-controller");
var router = express.Router();
var multer = require("multer");
var { v4: uuidv4 } = require("uuid");

const DIR = "./public/images/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

//mobile user login routes
router.post("/login", userController.userLogin);
router.post("/register", userController.userRegister);
router.post(
  "/updateProfile",
  upload.single("image"),
  userController.updateProfile
);
router.post("/updatePassword", userController.updatePassword);
router.post("/updateLocation", userController.updateLocation);
router.post("/getNotification", userController.getNotification);
router.get("/getHomeProduct", userController.getHomeProduct);
router.post("/getShopDetail", userController.getShopDetail);
router.post("/updateFavourite", userController.updateFavourite);
router.post("/getFavourite", userController.getFavourite);

module.exports = router;
