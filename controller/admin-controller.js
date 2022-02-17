//define controller

var UseModel = require("../models/admin-modal");
module.exports = {
  adminLogin: async function (req, res) {
    const user = await UseModel.getAdminLogin(req.body);

    if (!user) {
      return res.send({ message: "Đăng nhập thất bại" });
    }
    return res.send({ message: "Đăng nhập thành công", user: user, code: 0 });
  },
};
