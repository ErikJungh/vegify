// When server is live it is reachable at 
// http://vegify-2.platform-spanning.systems:3000/

// Get Api key 
require('dotenv').config()

//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 5000;
const openfoodfacts = require('./openfoodfacts')
const dabas = require('./dabas')
const cache = require('./cache')
const url = require('url');
const db = require('./db');
var express = require("express");
const { response } = require("express");

const checker = require("./checker");
const mongoose = require("mongoose");
const Router = require("./routes")

const app = express();
app.use(express.json());

var image_folder = express();
image_folder.use(express.static(__dirname + '/uploads'));
image_folder.listen(8080);


app.use(Router);

app.listen(port, () => {
    console.log("Server running on port 5000");
});


app.get("/product/:gtin([0-9]{8,14})", (req, res, next) => {
    var product = req.params.gtin;

    if (product != undefined && cache.isCached(product.toString())) {

        res.end(JSON.stringify(cache.get(product.toString())));
        return;
    }
    // Try to get items with Vegify DB
    db.getVegifyProductByGTIN(product, function(result){
        console.log("vegify product: " + result)
        if(result.success == false){
            // Try to get items with OpenFoodFacts 
            openfoodfacts.getItemByGTIN(product, function (result) {
                if (result.success == false) {
                    console.log("DIDNT FIND AT OPENFOODFACTS, TRYNG WITH DABAS")
                    // Try to get items with dabas
                    dabas.getItemByGTIN(product, function (result) {
                        cache.set(product.toString(), result);
                        res.end(JSON.stringify(result));
                    });
                }
                else {
                    cache.set(product.toString(), result);
                    res.end(JSON.stringify(result));
                }
            });
        }
        else{
            cache.set(product.toString(), result);
            res.end(JSON.stringify(result));
        }
    })

});

app.get("/product/:gtin([0-9]{8,14})/full", (req, res, next) => {
    if (cache.isCached(req.url)) {
        res.end(JSON.stringify(cache.get(req.url)));
        return;
    }
    var product = req.params.gtin;

    dabas.getFullItemInfoByGTIN(product, function (result) {
        cache.set(req.url, result);
        res.end(result);
    });

});

app.get("/product/:search", (req, res, next) => {
    if (cache.isCached(req.url)) {
        res.end(JSON.stringify(cache.get(req.url)));
        return;
    }

    var search_string = req.params.search;
    console.log("Search by string: " + search_string)

    // Try to get items in our own Vegify DB 
    db.searchVegifyProductsByString(search_string, function (result) {
        if (result == [] || result == "") {
            // Try to get items with OpenFoodFacts 
            openfoodfacts.getItemByString(search_string, function (result) {
                if (result == []) {
                    console.log("DIDNT FIND ANY ITEMS IN OPENFOODFACTS, TRYNG WITH DABAS")

                    // Try to get items with dabas
                    dabas.getItemByString(search_string, function (result) {
                        cache.set(req.url, result);
                        res.end(result);
                    });
                }
                else {
                    cache.set(req.url, result);
                    res.end(JSON.stringify(result));
                }
            });
        }
        else {
            cache.set(req.url, result);
            res.end(JSON.stringify(result));
        }
    });



});

//Create HTTP server and listen on port 3000 for requests
//
const server = http.createServer((req, res) => {
    //Set the response HTTP header with HTTP status and Content type
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});





