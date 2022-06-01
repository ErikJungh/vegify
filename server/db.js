const mongoose = require('mongoose');

var productModel = require("./product");
const fs = require('fs');
const credentials = './db-cert.pem'

const failure = {
  success: false,
  ingredienser: null,
  namn: null,
  markningar: null,
  Forpackningsstorlek: null,
  lank: null,
  preferenser: {
    Kräftdjur: null,
    Ägg: null,
    Senap: null,
    Fisk: null,
    Blötdjur: null,
    Gluten: null,
    Laktos: null,
    Nötter: null,
    Jordnötter: null,
    Soja: null,
    Svaveldioxid: null,
    Sesamfrö: null,
    Vegan: null,
    Vegetarian: null
  }
}

// Connect to MongoDB 
const client = 'mongodb+srv://cluster0.zwpul.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority';

//Connect to MongoDB 
mongoose.connect(client, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  sslKey: credentials,
  sslCert: credentials
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});



module.exports = {
  getVegifyProductByGTIN: function (gtin, callback) {
    console.log("gtin" + gtin);
    productModel.find({ GTIN: gtin }, function (err, doc) {
      if (err) {
        console.log("Something wrong when getting vegify product by gtin!");
        response.status(500).json({
          error: err
        });
      }
      if (doc[0] == undefined) { // || !doc.accepted){
        console.log("failed")
        callback(failure)
      }
      else {

        doc = doc[0]
        var obj = {
          success: true,
          GTIN: doc.GTIN,
          Varumarke: doc.brand,
          ingredienser: doc.ingredients,
          namn: doc.name,
          markningar: null,
          Forpackningsstorlek: doc.packagesize,
          lank: doc.image,
          preferenser: doc.allergens
        }

        //var parsed = JSON.parse(doc)
        //console.log(parsed)
        callback(obj)
      }


    });
  },
  searchVegifyProductsByString: function (search_string, callback) {
    console.log("search_string" + search_string);
    result = []
    productModel.find({ name: { $regex: search_string } }, function (err, docs) {
      console.log("DoCS: " + docs)
      if (err) {
        console.log("Something wrong when getting vegify products by search_string!");
        response.status(500).json({
          error: err
        });
      }
      if (docs == undefined || docs == "") {
        console.log("failed")
        callback(result)
      }
      else {
        docs.forEach((doc, key, arr) => {
          // (!doc.accepted){
          var obj = {
            success: true,
            GTIN: doc.GTIN,
            ingredienser: doc.ingredients,
            namn: doc.name,
            Varumarke: doc.brand,
            markningar: null,
            Forpackningsstorlek: doc.packagesize,
            lank: doc.image,
            preferenser: doc.allergens
          }
          result.push(obj)
          if (Object.is(arr.length - 1, key)) {
            callback(result)

          }
        });


          
        }
    });
  }
}
