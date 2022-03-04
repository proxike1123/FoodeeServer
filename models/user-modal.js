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
    const arr = await collection.find({ phone: username }).toArray();
    if (arr.length == 0) {
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
      client.close();
      return result;
    }
    client.close();
    return { acknowledged: false };
  },
  updateProfile: async (data) => {
    console.log(data);
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");

    var myquery = { user_id: data.user_id };
    var newvalues = {
      $set: {
        name: data.name,
        dob: data.dob,
        gender: data.gender,
        avatar: data.avatar,
      },
    };

    const result = await collection.updateOne(myquery, newvalues);
    const user = await collection.findOne({ user_id: data.user_id });
    client.close();
    return user;
  },
  updatePassword: async (data) => {
    console.log(data);
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + data.password)
      .digest("hex");
    await client.connect();
    var old = crypto
      .createHash("md5")
      .update(salt + data.old)
      .digest("hex");
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");
    var myquery = { user_id: data.user_id };
    var newvalues = {
      $set: {
        password: hashPassword,
      },
    };
    const result = await collection.findOne(myquery);
    console.log(result && result.password == old);
    if (result && result.password == old) {
      const re = await collection.updateOne(myquery, newvalues);
      if (re && re.acknowledged) {
        const user = await collection.findOne({ user_id: data.user_id });
        client.close();
        return true;
      }
    } else return false;
  },
  updateLocation: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("user");

    var myquery = { user_id: data.user_id };
    var newvalues = {
      $set: {
        address: data.address,
      },
    };
    const result = await collection.updateOne(myquery, newvalues);
    const user = await collection.findOne({ user_id: data.user_id });

    client.close();
    return user;
  },
  getNotification: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("notify");
    const result = await collection.find({ user_id: data.user_id }).toArray();
    client.close();
    return result;
  },
  getHomeProduct: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const collection2 = client.db("FoodeeDatabase").collection("agency");
    const products = await collection.find({}).toArray();
    const shops = await collection2.find({}).toArray();
    client.close();
    return { products: products, shops: shops };
  },
  getShopDetail: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const collection2 = client.db("FoodeeDatabase").collection("agency");
    const collection3 = client.db("FoodeeDatabase").collection("rating");
    const collection4 = client.db("FoodeeDatabase").collection("favourite");
    const products = await collection.find({ shop_id: data.shop_id }).toArray();
    const ratings = await collection3.find({ shop_id: data.shop_id }).toArray();
    const shops = await collection2.findOne({ shop_id: data.shop_id });
    const fav = await collection4.findOne({
      shop_id: data.shop_id,
      user_id: data.user_id,
    });
    client.close();
    return {
      products: products,
      shops: shops,
      ratings: ratings,
      favourite: fav ? true : false,
    };
  },
  updateFavourite: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("favourite");
    var value = { shop_id: data.shop_id, user_id: data.user_id };
    if (data.value) {
      const result = await collection.insertOne(value);
    } else {
      const result = await collection.deleteOne(value);
    }
    client.close();
    return true;
  },
  getFavourite: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("favourite");
    const list = await collection.find({ user_id: data.user_id }).toArray();
    const shop = [];
    list.map((item) => shop.push(item.shop_id));
    const collection2 = client.db("FoodeeDatabase").collection("agency");
    const shops = await collection2.find({ shop_id: { $in: shop } }).toArray();
    client.close();
    return shops;
  },
};
