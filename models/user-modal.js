//define view
var client = require("./database");
var salt =
  'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer';
var crypto = require("crypto");

module.exports = {
  getUserLogin: async ({ username, password }) => {
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");
    const query = { username: username, password: hashPassword };
    const result = await collection.findOne(query);
    client.close();
    return result;
  },
  createUser: function () {
    data = "Form data was inserted";
    return data;
  },
  fetchUser: function () {
    data = "data was fetched";
    client.connect(async (err) => {
      const collection = client.db("FoodeeDatabase").collection("user");
      const query = { username: "binnd1" };
      const result = await collection.findOne(query);
      console.log("result", result);
      client.close();
    });
    return data;
  },
  editUser: function (editData) {
    data = "Data is edited by id: " + editData;
    return data;
  },
  UpdateUser: function (updateId) {
    data = "Data was updated by id: " + updateId;
    return data;
  },
  deleteUser: function (deleteId) {
    data = "Data was deleted by id: " + deleteId;
    return data;
  },
};
