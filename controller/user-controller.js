//define controller

var UserModel = require("../models/user-model");
module.exports = {
  userLogin: async function (req, res) {
    const user = await UserModel.getUserLogin(req.body);
    if (!user) {
      return res.send({ message: "Đăng nhập thất bại" });
    }
    return res.send({ message: "Đăng nhập thành công", user: user, code: 0 });
  },
  userRegister: async function (req, res) {
    const result = await UserModel.userRegister(req.body);
    if (result && result.acknowledged) {
      return res.send({ message: "Thành công ", code: 0 });
    }
    return res.send({ message: "Thất bại", code: 1 });
  },
  updateProfile: async function (req, res) {
    let url = "";
    if (req.file && req.file.filename) {
      url =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    }
    const data = {
      user_id: req.body.user_id,
      name: req.body.name,
      dob: req.body.dob,
      gender: req.body.gender,
      avatar: url != "" ? url : req.body.avatar,
    };
    const user = await UserModel.updateProfile(data);
    if (user) {
      return res.send({ message: "Cập nhật thành công", code: 0, user: user });
    }
  },
  updatePassword: async function (req, res) {
    const result = await UserModel.updatePassword(req.body);

    if (result == true) {
      return res.send({ message: "Thành công ", code: 0 });
    }
    return res.send({ message: "Thất bại", code: 1 });
  },
  updateLocation: async function (req, res) {
    const user = await UserModel.updateLocation(req.body);
    if (user) {
      return res.send({ message: "Cập nhật thành công", code: 0, user: user });
    }
  },
  getNotification: async function (req, res) {
    const result = await UserModel.getNotification(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  getHomeProduct: async function (req, res) {
    const result = await UserModel.getHomeProduct(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  getShopDetail: async function (req, res) {
    const result = await UserModel.getShopDetail(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  updateFavourite: async function (req, res) {
    const result = await UserModel.updateFavourite(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
      });
    }
  },
  getFavourite: async function (req, res) {
    const result = await UserModel.getFavourite(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  createOrder: async function (req, res) {
    const result = await UserModel.createOrder(req.body);
    if (result && result.acknowledged) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
      });
    }
  },
  getOrder: async function (req, res) {
    const result = await UserModel.getOrder(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  getOrderDetail: async function (req, res) {
    const result = await UserModel.getOrderDetail(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
  cancelOrder: async function (req, res) {
    const result = await UserModel.cancelOrder(req.body);
    if (result && result.acknowledged) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
      });
    }
  },
  insertReview: async function (req, res) {
    let url = "";
    if (req.file && req.file.filename) {
      url =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    }
    const data = {
      ...req.body,
      star: Number(req.body.star),
      image: url != "" ? url : "",
      reply: "",
    };
    const result = await UserModel.insertReview(data);
    if (result && result.acknowledged) {
      return res.send({ message: "Cập nhật thành công", code: 0 });
    }
  },
  search: async function (req, res) {
    const result = await UserModel.search(req.body);
    if (result) {
      return res.send({
        message: "Cập nhật thành công",
        code: 0,
        data: result,
      });
    }
  },
};
