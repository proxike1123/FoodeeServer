//define Router path

var express = require("express");
var adminController = require("../controller/admin-controller");
var router = express.Router();

//mobile user login routes
router.post("/login", adminController.adminLogin);
router.get("/getShopList", adminController.getShopList);
router.post("/updateShopStatus", adminController.updateShopStatus);
router.post("/getShopDetail", adminController.getShopDetail);
router.post("/getShopProduct", adminController.getShopProduct);
router.get("/getCustomerList", adminController.getCustomerList);
router.post("/updateCustomerStatus", adminController.updateCustomerStatus);
router.post("/getShopReview", adminController.getShopReview);

module.exports = router;
