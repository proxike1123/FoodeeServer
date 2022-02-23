//define controller
var { v4: uuidv4 } = require("uuid");
var ShopModal = require("../models/shop-modal");
module.exports = {
  shopLogin: async function (req, res) {
    const user = await ShopModal.getShopLogin(req.body);
    if (!user) {
      return res.send({ message: "Đăng nhập thất bại" });
    }
    return res.send({ message: "Đăng nhập thành công", user: user, code: 0 });
  },

  shopRegister: async function (req, res) {
    const result = await ShopModal.shopRegister(req.body);
    if (result && result.acknowledged) {
      return res.send({ message: "Thành công ", code: 0 });
    }
    return res.send({ message: "Thất bại" });
  },

  getProfile: async function (req, res) {
    const user = await ShopModal.getProfile(req.body.shop_id);
    if (!user) {
      return res.send({ message: "Thất bại" });
    }
    return res.send({ message: "Thành công", user: user, code: 0 });
  },

  getListProduct: async function (req, res) {
    const product = await ShopModal.getListProduct(req.body.shop_id);
    if (!product) {
      return res.send({ message: "Thất bại" });
    }
    return res.send({ message: "Thành công", product: product, code: 0 });
  },

  createProduct: async function (req, res) {
    let url = "";
    if (req.file && req.file.filename) {
      url =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    }

    const data = {
      shop_id: req.body.shop_id,
      price: req.body.price,
      cate_id: req.body.cate_id,
      name: req.body.name,
      tag: req.body.tag,
      avatar: url,
      sale: 0,
      product_id: uuidv4(),
    };

    const shop_id = req.body.shop_id;
    const result = await ShopModal.createProduct(data);
    if (result && result.acknowledged) {
      const data = await ShopModal.getListProduct(shop_id);
      if (data.length == 0) {
        const result = await ShopModal.updateShopAvg({ shop_id, avg: 0 });
      } else if (data.length == 1) {
        const result = await ShopModal.updateShopAvg({
          shop_id,
          avg: data[0].price,
        });
      } else {
        let avg = 0;
        for (var i = 0; i < data.length; i++) {
          avg += Number(data[i].price);
        }
        const result = await ShopModal.updateShopAvg({
          shop_id,
          avg: avg / data.length,
        });
      }
      return res.send({ message: "Thêm sản phẩm thành công", code: 0 });
    }
  },

  updateProduct: async function (req, res) {
    let url = "";
    if (req.file && req.file.filename) {
      url =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    }
    const data = {
      price: req.body.price,
      cate_id: req.body.cate_id,
      name: req.body.name,
      tag: req.body.tag,
      avatar: url != "" ? url : req.body.avatar,
      product_id: req.body.product_id,
    };
    const shop_id = req.body.shop_id;
    const result = await ShopModal.updateProduct(data);
    if (result && result.acknowledged) {
      const data = await ShopModal.getListProduct(shop_id);
      if (data.length == 0) {
        const result = await ShopModal.updateShopAvg({ shop_id, avg: 0 });
      } else if (data.length == 1) {
        const result = await ShopModal.updateShopAvg({
          shop_id,
          avg: data[0].price,
        });
      } else {
        let avg = 0;
        for (var i = 0; i < data.length; i++) {
          avg += Number(data[i].price);
        }
        const result = await ShopModal.updateShopAvg({
          shop_id,
          avg: avg / data.length,
        });
      }
      return res.send({ message: "Thêm sản phẩm thành công", code: 0 });
    }
  },

  deleteProduct: async function (req, res) {
    const shop_id = req.body.shop_id;
    const result = await ShopModal.deleteProduct(req.body.product_id);
    if (result && result.acknowledged) {
      const data = await ShopModal.getListProduct(shop_id);
      if (data.length == 0) {
        const result = await ShopModal.updateShopAvg({ shop_id, avg: 0 });
      } else if (data.length == 1) {
        const result = await ShopModal.updateShopAvg({
          shop_id,
          avg: data[0].price,
        });
      } else {
        let avg = 0;
        for (var i = 0; i < data.length; i++) {
          avg += Number(data[i].price);
        }
        const result = await ShopModal.updateShopAvg({
          shop_id,
          avg: avg / data.length,
        });
      }
      return res.send({ message: "Thành công", code: 0 });
    }
    return res.send({ message: "Thất bại" });
  },

  getProduct: async function (req, res) {
    const product = await ShopModal.getProduct(req.body.product_id);
    if (!product) {
      return res.send({ message: "Thất bại" });
    }
    return res.send({ message: "Thành công", data: product, code: 0 });
  },

  updateProfile: async function (req, res) {
    let url = "";
    if (req.file && req.file.filename) {
      url =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    }

    const data = {
      shop_id: req.body.shop_id,
      shop_name: req.body.shop_name,
      address: req.body.address,
      phone: req.body.phone,
      active_time: JSON.parse(req.body.active_time),
      avatar: url != "" ? url : req.body.avatar,
    };

    const result = await ShopModal.updateProfile(data);
    if (result && result.acknowledged) {
      return res.send({ message: "Cập nhật thành công", code: 0 });
    }
  },
};