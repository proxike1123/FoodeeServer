//define view
var client = require("./database");
var salt =
  'd2g6IOP(U(&Â§)%UÂ§VUIPU(HN%V/Â§Â§URerjh0Ã¼rfqw4zoÃ¶qe54gÃŸ0Ã¤Q"LOU$3wer';
var crypto = require("crypto");
var { v4: uuidv4 } = require("uuid");
var ObjectId = require("mongodb").ObjectId;
var { admin } = require("./firebase-config");

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
    await client.connect();
    var hashPassword = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    const collection = client.db("FoodeeDatabase").collection("agency");
    console.log(collection);
    const arr = await collection.find({ email: username }).toArray();
    console.log(arr);
    if (arr.length == 0) {
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
        rating: 0,
        num_rate: 0,
      };
      const result = await collection.insertOne(query);
      return result;
    }
    client.close();
    return { acknowledged: false };
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
  getOrder: async ({ shop_id }) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("order");
    const query = { shop_id: shop_id };
    const result = await collection.find(query).toArray();
    client.close();
    return result;
  },
  getOrderDetail: async ({ order_id }) => {
    console.log(order_id);
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("order");
    const query = { order_id: order_id };
    const result = await collection.findOne(query);
    client.close();
    return result;
  },
  changeOrderStatus: async ({ order_id, status }) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("order");
    const collection2 = client.db("FoodeeDatabase").collection("product");
    const collection3 = client.db("FoodeeDatabase").collection("notify");
    const collection4 = client.db("FoodeeDatabase").collection("user");
    if (status === "Đã hoàn tất") {
      const order = await collection.findOne({ order_id: order_id });
      const products = order.product;
      products.map(async (item) => {
        const product = await collection2.findOne({
          product_id: item.product_id,
        });
        var value = {
          $set: {
            sale: item.qty + product.sale,
          },
        };
        const res = await collection2.updateOne(
          { product_id: item.product_id },
          value
        );
      });
    }
    var newvalues = {
      $set: {
        status: status,
      },
    };
    const result = await collection.updateOne(
      { order_id: order_id },
      newvalues
    );

    const order = await collection.findOne({ order_id: order_id });
    const notify = {
      notify_id: uuidv4(),
      status: status,
      title: "Thay đổi trạng thái đơn hàng",
      image: order.avatar,
      user_id: order.user_id,
      order_id: order.order_id,
    };
    const noti = await collection3.insertOne(notify);

    const user = await collection4.findOne({ user_id: order.user_id });
    console.log(user.fcm);
    console.log("before");

    let message = {
      notification: {
        title: "Foodee",
        body: "Cập nhật đơn hàng",
      },
    };

    admin
      .messaging()
      .sendToDevice(user.fcm, message)
      .then((response) => {
        console.log("Thành công");
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("after");

    client.close();
    return result;
  },
  getReview: async ({ shop_id }) => {
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("rating");
    const query = { shop_id: shop_id };
    const result = await collection.find(query).toArray();
    client.close();
    return result;
  },
  updateReply: async ({ _id, reply }) => {
    console.log(_id);
    await client.connect();
    const collection = client.db("FoodeeDatabase").collection("rating");
    const id = new ObjectId(_id);
    const query = { _id: id };
    var newvalues = {
      $set: {
        reply: reply,
      },
    };
    const result = await collection.updateOne(query, newvalues);
    console.log(result);
    client.close();
    return result;
  },
};
