//define controller

var AdminModal = require("../models/admin-model");
module.exports = {
  adminLogin: async function (req, res) {
    const user = await AdminModal.getAdminLogin(req.body);
    if (!user) {
      return res.send({ message: "Đăng nhập thất bại" });
    }
    return res.send({ message: "Đăng nhập thành công", user: user, code: 0 });
  },
  getShopList: async function (req, res) {
    const shop = await AdminModal.getShopList();
    if (!shop) {
      return res.send({ message: "Thất bại" });
    }
    return res.send({ message: "Thành công", data: shop, code: 0 });
  },
  updateShopStatus: async function (req, res) {
    const result = await AdminModal.updateShopStatus(req.body);
    if (result && result.acknowledged) {
      return res.send({ message: "Thành công", code: 0 });
    }
    return res.send({ message: "Thất bại" });
  },
  getShopDetail: async function (req, res) {
    const result = await AdminModal.getShopDetail(req.body.shop_id);
    if (result) {
      return res.send({ message: "Thành công", code: 0, data: result });
    }
    return res.send({ message: "Thất bại" });
  },
  getShopProduct: async function (req, res) {
    const result = await AdminModal.getShopProduct(req.body.shop_id);
    if (result) {
      return res.send({ message: "Thành công", code: 0, data: result });
    }
    return res.send({ message: "Thất bại" });
  },
  getCustomerList: async function (req, res) {
    const result = await AdminModal.getCustomerList();
    if (result) {
      return res.send({ message: "Thành công", code: 0, data: result });
    }
    return res.send({ message: "Thất bại" });
  },
  updateCustomerStatus: async function (req, res) {
    const result = await AdminModal.updateCustomerStatus(req.body);
    if (result && result.acknowledged) {
      return res.send({ message: "Thành công", code: 0 });
    }
    return res.send({ message: "Thất bại" });
  },
  getShopReview: async function (req, res) {
    const result = await AdminModal.getShopReview(req.body);
    if (result) {
      return res.send({ message: "Thành công", code: 0, data: result });
    }
    return res.send({ message: "Thất bại" });
  },
};
