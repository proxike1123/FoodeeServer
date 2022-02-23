//define Router path
var multer = require("multer");
var express = require("express");
var shopController = require("../controller/shop-controller");
var router = express.Router();
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
router.post("/login", shopController.shopLogin);
router.post("/register", shopController.shopRegister);
router.post("/profile", shopController.getProfile);
router.post(
  "/updateProfile",
  upload.single("image"),
  shopController.updateProfile
);
router.post(
  "/createProduct",
  upload.single("image"),
  shopController.createProduct
);
router.post("/getListProduct", shopController.getListProduct);
router.post("/getProduct", shopController.getProduct);
router.post(
  "/updateProduct",
  upload.single("image"),
  shopController.updateProduct
);
router.post("/deleteProduct", shopController.deleteProduct);

module.exports = router;
