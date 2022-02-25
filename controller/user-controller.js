//define controller

var UseModel = require("../models/user-modal");
module.exports = {
  userLogin: async function (req, res) {
    const user = await UseModel.getUserLogin(req.body);
    if (!user) {
      return res.send({ message: "Đăng nhập thất bại" });
    }
    return res.send({ message: "Đăng nhập thành công", user: user, code: 0 });
  },
  userRegister: async function (req, res) {
    const result = await UseModel.userRegister(req.body);
    if (result && result.acknowledged) {
      return res.send({ message: "Thành công ", code: 0 });
    }
    return res.send({ message: "Thất bại" });
  },
};
