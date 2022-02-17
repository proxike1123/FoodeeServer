var express = require("express");
var router = express.Router();
var { spawn } = require("child_process");

/* GET home page. */
router.get("/", function (req, res, next) {
  const json = [
    {
      food_id: 1,
      title: "Thịt gà hà nội",
      price: 30,
      num_orders: 35,
      category: "Thịt gà",
      avg_rating: 3.9,
      num_rating: 10,
      tag: "Thịt",
    },
    {
      food_id: 2,
      title: "Thịt heo hà nội",
      price: 25,
      num_orders: 40,
      category: "Thịt heo",
      avg_rating: 3.8,
      num_rating: 15,
      tag: "Thịt",
    },
    {
      food_id: 3,
      title: "Thịt heo",
      price: 25,
      num_orders: 10,
      category: "Thịt heo",
      avg_rating: 3,
      num_rating: 10,
      tag: "Thịt",
    },
    {
      food_id: 4,
      title: "Cá ba sa",
      price: 30,
      num_orders: 25,
      category: "Cá",
      avg_rating: 2.5,
      num_rating: 5,
      tag: "Cá",
    },
    {
      food_id: 5,
      title: "Cá thu",
      price: 60,
      num_orders: 40,
      category: "Cá thu",
      avg_rating: 4.6,
      num_rating: 30,
      tag: "Cá",
    },
    {
      food_id: 6,
      title: "Thịt bò",
      price: 80,
      num_orders: 40,
      category: "Thịt bò",
      avg_rating: 4.2,
      num_rating: 28,
      tag: "Thịt",
    },
  ];

  const order = [
    {
      order_id: 1,
      user_id: 2,
      food_id: 5,
      date: "6/28/2019  9:26:00 AM",
      status: "served",
      amount: 60,
    },
    {
      order_id: 2,
      user_id: 3,
      food_id: 5,
      date: "6/29/2019  9:26:00 AM",
      status: "served",
      amount: 60,
    },
    {
      order_id: 3,
      user_id: 2,
      food_id: 6,
      date: "6/30/2019  9:26:00 AM",
      status: "served",
      amount: 80,
    },
    {
      order_id: 4,
      user_id: 1,
      food_id: 5,
      date: "7/1/2019  9:26:00 AM",
      status: "served",
      amount: 60,
    },
    {
      order_id: 5,
      user_id: 2,
      food_id: 5,
      date: "7/2/2019  9:26:00 AM",
      status: "served",
      amount: 60,
    },
    {
      order_id: 6,
      user_id: 2,
      food_id: 5,
      date: "7/2/2019  9:26:00 AM",
      status: "served",
      amount: 60,
    },
  ];

  var jObject = JSON.stringify(json);

  var orderStr = JSON.stringify(order);

  var pth = spawn("python", ["./process.py", orderStr, jObject]);
  pth.stderr.pipe(process.stderr);
  pth.stdout.on("data", (data) => {
    console.log(JSON.parse(data));
    res.render("index", { title: data.toString() });
  });
});

module.exports = router;
