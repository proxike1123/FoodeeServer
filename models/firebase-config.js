var admin = require("firebase-admin");

var serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodee-25212.firebaseio.com",
});

module.exports.admin = admin;
