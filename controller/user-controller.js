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

  UserForm: function (req, res) {
    res.render("user");
  },
  createUser: function (req, res) {
    const createData = UseModel.createUser();
    res.send("<h1>" + createData + "</h1>");
  },
  fetchUser: function (req, res) {
    const fetchData = UseModel.fetchUser();
    res.send("<h1>" + fetchData + "</h1>");
  },
  editUser: function (req, res) {
    const editId = req.params.id;
    const editData = UseModel.editUser(editId);
    res.render("user", { editData: editData, editId: editId });
  },
  UpdateUser: function (req, res) {
    const updateId = req.params.id;
    const updateData = UseModel.UpdateUser(updateId);
    res.send("<h1>" + updateData + "</h1>");
  },
  deleteUser: function (req, res) {
    const deleteId = req.params.id;
    const deleteData = UseModel.deleteUser(deleteId);
    res.send("<h1>" + deleteData + "</h1>");
  },
};
