//define view
var client = require("./database");
var salt =
  'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer';
var crypto = require("crypto");
var { v4: uuidv4 } = require("uuid");

module.exports = {
  getShopLogin: async ({ username, password }) => {
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");
    const query = { email: username, password: hashPassword };
    const result = await collection.findOne(query);
    client.close();
    return result;
  },
  shopRegister: async ({ username, password }) => {
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");
    const query = {
      email: username,
      password: hashPassword,
      phone: "",
      active_time: {
        date: [false, false, false, false, false, false, false],
        from: "00:00",
        to: "00:00",
      },
      address: "",
      avatar: "",
      avg_price: 0,
      shop_name: "",
      shop_id: uuidv4(),
      info: false,
      lock: false,
      products: 0,
    };
    const result = await collection.insertOne(query);
    console.log(result);
    client.close();
    return result;
  },
  getProfile: async (shop_id) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");
    const query = { shop_id };
    const result = await collection.findOne(query);
    client.close();
    return result;
  },
  updateProfile: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");

    var myquery = { shop_id: data.shop_id };
    var newvalues = {
      $set: {
        shop_name: data.shop_name,
        address: data.address,
        phone: data.phone,
        active_time: data.active_time,
        avatar: data.avatar,
        info: true,
      },
    };

    const result = await collection.updateOne(myquery, newvalues);
    client.close();
    return result;
  },
  createProduct: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const result = await collection.insertOne(data);
    client.close();
    return result;
  },
  updateProduct: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    var myquery = { product_id: data.product_id };
    var newvalues = {
      $set: {
        price: data.price,
        cate_id: data.cate_id,
        name: data.name,
        tag: data.tag,
        avatar: data.avatar,
      },
    };

    const result = await collection.updateOne(myquery, newvalues);
    client.close();
    return result;
  },
  getListProduct: async (shop_id) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const query = { shop_id: shop_id };
    const result = await collection.find(query).toArray();

    client.close();
    return result;
  },
  getProduct: async (product_id) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const query = { product_id };
    const result = await collection.findOne(query);

    client.close();
    return result;
  },
  deleteProduct: async (product_id) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const query = { product_id };
    const result = await collection.deleteOne(query);
    client.close();
    return result;
  },
  updateShopAvg: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("agency");

    var myquery = { shop_id: data.shop_id };
    var newvalues = {
      $set: {
        avg_price: data.avg,
        products: data.products,
      },
    };

    const result = await collection.updateOne(myquery, newvalues);
    client.close();
    return result;
  },
};
