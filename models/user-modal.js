//define view
var client = require("./database");
var salt =
  'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer';
var crypto = require("crypto");
var { v4: uuidv4 } = require("uuid");

module.exports = {
  getUserLogin: async ({ username, password, fcm }) => {
    console.log(fcm);
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");
    const query = { phone: username, password: hashPassword };
    const result = await collection.findOne(query);
    if (result) {
      var newvalues = {
        $set: {
          fcm: fcm,
        },
      };
      const update = await collection.updateOne(query, newvalues);
      console.log(update);
    }
    client.close();
    return result;
  },
  userRegister: async ({ username, password }) => {
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");
    const query = {
      user_id: uuidv4(),
      phone: username,
      password: hashPassword,
      name: "Chưa cập nhật",
      address: "",
      avatar: "",
      dob: "",
      gender: "",
      lock: false,
      fav: [],
      fcm: "",
    };
    const result = await collection.insertOne(query);
    console.log(result);
    client.close();
    return result;
  },
};
