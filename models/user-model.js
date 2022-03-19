//define view
var client = require("./database");
var salt =
  'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer';
var crypto = require("crypto");
var { v4: uuidv4 } = require("uuid");
var spawn = require("child_process").spawnSync;

recommendations = async (order, product) => {
  var result = spawn("python", ["./process.py", order, product], {
    cwd: process.cwd(),
    env: process.env,
    stdio: "pipe",
    encoding: "utf-8",
  });
  return JSON.parse(result.stdout);
};

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
    const user_id = data.user_id;

    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const collection2 = client.db("FoodeeDatabase").collection("agency");
    const collection3 = client.db("FoodeeDatabase").collection("order");
    const orders = await collection3
      .find({ user_id: user_id, status: "Đã hoàn tất" })
      .toArray();
    const arr = [];
    orders.map((item) => {
      item.product.map((i) => {
        arr.indexOf(i.product_id) < 0 ? arr.push(i.product_id) : null;
      });
    });

    const listOrder = arr.map((item) => {
      return { oder_id: 0, user_id: 1, product_id: item };
    });

    const products = await collection.find({}).toArray();
    const shops = await collection2.find({}).toArray();

    const sortProdcut = products.map((item) => {
      return {
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        avatar: item.avatar,
        cate_id: item.cate_id,
        sale: item.sale,
        tag: item.tag,
        shop_id: item.shop_id,
        _id: item._id,
      };
    });
    let recoment = [];

    if (listOrder.length > 0) {
      var reProduct = JSON.stringify(sortProdcut);
      var reOrder = JSON.stringify(listOrder.reverse());
      recoment = await recommendations(reOrder, reProduct);
      const listReID = recoment.map((item) => item.product_id);
      let addList = [];
      products.map((item) =>
        listReID.indexOf(item.product_id) < 0 ? addList.push(item) : null
      );
      recoment = [...recoment, ...addList];
    }
    client.close();
    return {
      products: listOrder.length > 0 ? recoment : products,
      shops: shops,
    };
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
  createOrder: async (data) => {
    await client.connect();
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    const collection = client.db("FoodeeDatabase").collection("order");
    const item = {
      ...data.data,
      order_id: uuidv4(),
      review: false,
      status: "Chờ xác nhận",
      time_order: date + "-" + month + "-" + year + " " + hours + ":" + minutes,
    };
    const result = await collection.insertOne(item);
    client.close();
    return result;
  },
  getOrder: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("order");
    const result = await collection.find({ user_id: data.user_id }).toArray();
    client.close();
    return result;
  },
  getOrderDetail: async (data) => {
    console.log(data);
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("order");
    const result = await collection.findOne({ order_id: data.order_id });
    client.close();
    return result;
  },
  cancelOrder: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("order");
    var newvalues = {
      $set: {
        status: "Hủy",
      },
    };
    const result = await collection.updateOne(
      { order_id: data.order_id },
      newvalues
    );
    client.close();
    return result;
  },
  insertReview: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("rating");
    const result = await collection.insertOne({ ...data });

    const collection2 = client.db("FoodeeDatabase").collection("order");
    var reviewStatus = {
      $set: {
        review: true,
      },
    };
    const update = await collection2.updateOne(
      { order_id: data.order_id },
      reviewStatus
    );

    const collection3 = client.db("FoodeeDatabase").collection("agency");

    const listReview = await collection
      .find({ shop_id: data.shop_id })
      .toArray();

    if (listReview.length > 0) {
      let avg = 0;
      listReview.map((item) => (avg = avg + item.star));
      var shopValue = {
        $set: {
          num_rate: listReview.length,
          rating: avg / listReview.length,
        },
      };
      const shopUpdate = await collection3.updateOne(
        { shop_id: data.shop_id },
        shopValue
      );
    }

    client.close();
    return result;
  },
  search: async (data) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("product");
    const collection2 = client.db("FoodeeDatabase").collection("agency");
    await collection.createIndex({ name: "text" });
    const product = await collection
      .find({ $text: { $search: data.search } })
      .toArray();
    let shop = [];
    product.map((item) => {
      if (shop.indexOf(item.shop_id) < 0) {
        shop.push(item.shop_id);
      }
    });
    const shops = await collection2.find({ shop_id: { $in: shop } }).toArray();

    client.close();
    return { products: product, shops: shops };
  },
};
