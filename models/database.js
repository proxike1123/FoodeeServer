const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://root:root@foodee.yp5sn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client;
