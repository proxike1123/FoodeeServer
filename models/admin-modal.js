//define view
var client = require("./database");
var salt =
  'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer';
var crypto = require("crypto");

module.exports = {
  getAdminLogin: async ({ username, password }) => {
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("admin");
    const query = { user_name: username, password: hashPassword };
    const result = await collection.findOne(query);
    client.close();
    return result;
  },
  getShopList: async () => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");
    const result = await collection.find({}).toArray();
    client.close();
    return result;
  },
  updateShopStatus: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");

    var myquery = { shop_id: data.shop_id };
    var newvalues = {
      $set: {
        lock: data.status,
      },
    };
    const result = await collection.updateOne(myquery, newvalues);
    client.close();
    return result;
  },
  getShopDetail: async (shop_id) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");
    const result = await collection.findOne({
      shop_id: shop_id,
    });
    client.close();
    return result;
  },
  getShopProduct: async (shop_id) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const result = await collection
      .find({
        shop_id: shop_id,
      })
      .toArray();
    client.close();
    return result;
  },
  getCustomerList: async () => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");
    const result = await collection.find({}).toArray();
    client.close();
    return result;
  },
  updateCustomerStatus: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");

    var myquery = { user_id: data.user_id };
    var newvalues = {
      $set: {
        lock: data.status,
      },
    };
    const result = await collection.updateOne(myquery, newvalues);
    client.close();
    return result;
  },
};
