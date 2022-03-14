//define controller
var { v4: uuidv4 } = require("uuid");
var ShopModel = require("../models/shop-model");
module.exports = {
  shopLogin: async function (req, res) {
    const user = await ShopModel.getShopLogin(req.body);
    if (!user) {
      return res.send({ message: "Đăng nhập thất bại" });
    }
    return res.send({ message: "Đăng nhập thành công", user: user, code: 0 });
  },

  shopRegister: async function (req, res) {
    const result = await ShopModel.shopRegister(req.body);
    if (result && result.acknowledged) {
      return res.send({ message: "Thành công ", code: 0 });
    }
    return res.send({ message: "Thất bại", code: 1 });
  },

  getProfile: async function (req, res) {
    const user = await ShopModel.getProfile(req.body.shop_id);
    if (!user) {
      return res.send({ message: "Thất bại" });
    }
    return res.send({ message: "Thành công", user: user, code: 0 });
  },

  getListProduct: async function (req, res) {
    const product = await ShopModel.getListProduct(
      req.body.shop_id,
      req.body.search
    );
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
    const result = await ShopModel.createProduct(data);
    if (result && result.acknowledged) {
      const data = await ShopModel.getListProduct(shop_id);
      if (data.length == 0) {
        const result = await ShopModel.updateShopAvg({ shop_id, avg: 0 });
      } else if (data.length == 1) {
        const result = await ShopModel.updateShopAvg({
          shop_id,
          avg: data[0].price,
          products: data.length,
        });
      } else {
        let avg = 0;
        for (var i = 0; i < data.length; i++) {
          avg += Number(data[i].price);
        }
        const result = await ShopModel.updateShopAvg({
          shop_id,
          avg: avg / data.length,
          products: data.length,
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
    const result = await ShopModel.updateProduct(data);
    if (result && result.acknowledged) {
      const data = await ShopModel.getListProduct(shop_id);
      if (data.length == 0) {
        const result = await ShopModel.updateShopAvg({
          shop_id,
          avg: 0,
          products: data.length,
        });
      } else if (data.length == 1) {
        const result = await ShopModel.updateShopAvg({
          shop_id,
          avg: data[0].price,
          products: data.length,
        });
      } else {
        let avg = 0;
        for (var i = 0; i < data.length; i++) {
          avg += Number(data[i].price);
        }
        const result = await ShopModel.updateShopAvg({
          shop_id,
          avg: avg / data.length,
          products: data.length,
        });
      }
      return res.send({ message: "Thêm sản phẩm thành công", code: 0 });
    }
  },

  deleteProduct: async function (req, res) {
    const shop_id = req.body.shop_id;
    const result = await ShopModel.deleteProduct(req.body.product_id);
    if (result && result.acknowledged) {
      const data = await ShopModel.getListProduct(shop_id);
      if (data.length == 0) {
        const result = await ShopModel.updateShopAvg({ shop_id, avg: 0 });
      } else if (data.length == 1) {
        const result = await ShopModel.updateShopAvg({
          shop_id,
          avg: data[0].price,
        });
      } else {
        let avg = 0;
        for (var i = 0; i < data.length; i++) {
          avg += Number(data[i].price);
        }
        const result = await ShopModel.updateShopAvg({
          shop_id,
          avg: avg / data.length,
          products: data.length,
        });
      }
      return res.send({ message: "Thành công", code: 0 });
    }
    return res.send({ message: "Thất bại" });
  },

  getProduct: async function (req, res) {
    const product = await ShopModel.getProduct(req.body.product_id);
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

    const result = await ShopModel.updateProfile(data);
    if (result && result.acknowledged) {
      return res.send({ message: "Cập nhật thành công", code: 0 });
    }
  },
  getOrder: async function (req, res) {
    const result = await ShopModel.getOrder(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  getOrderDetail: async function (req, res) {
    const result = await ShopModel.getOrderDetail(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  changeOrderStatus: async function (req, res) {
    const result = await ShopModel.changeOrderStatus(req.body);
    if (result && result.acknowledged) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
      });
    }
  },
  getReview: async function (req, res) {
    const result = await ShopModel.getReview(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  updateReply: async function (req, res) {
    const result = await ShopModel.updateReply(req.body);
    if (result && result.acknowledged) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
      });
    }
  },
};
