require('dotenv').config()
const { fail } = require('assert');
const https = require("https");
const { ListCollectionsCursor } = require('mongodb');
const cache = require("./cache");
const allergenkoder = {
    kraftdjur: "AC",
    agg: "AE",
    senap: "BM",
    fisk: "AF",
    blotdjur: "UM",
    gluten: "AW",
    mjolk: "AM",
    notter: "AN",
    jordnotter: "AP",
    soja: "AY",
    svaveldioxid: "AU",
    sesamfro: "AS"
}
const failure={
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

function extractData(jsonData) {

    // Vad vi kollar efter (dessa skickas till client side i ett objekt: preferenser)
    var kraftdjur = false;
    var agg = false; 
    var senap = false; 
    var fisk = false;
    var blotdjur = false; 
    var gluten = false; 
    var lactose = false;
    var notter = false; 
    var jordnotter = false; 
    var soja = false; 
    var svaveldioxid = false;
    var sesamfro = false; 
    var vegan = true;
    var vegetarian = true;


    // Artikelbenamning 
    var artikelNamn = jsonData.Artikelbenamning

    // Ingrediensforteckning
    var ingredienser = jsonData.Ingrediensforteckning
    ingredienser = [ingredienser]

    // Märkningar (vegansk/laktos ..)
    var Markningar = jsonData.Markningar

    // Länk till bild på produkten
    if(jsonData.Bilder.length != 0){
        var Lank = jsonData.Bilder[0].Lank
    }


    if(Markningar.length != 0){
        Markningar.forEach(markning => {
            var typkod = markning.Typkod
            console.log("TYPKOD:::: " + typkod)
            if(typkod == "VEGAN"){
                vegan = true
                console.log("FOUND VEGAN WARE")
            }  
            if(typkod == "FREE_FROM_MILK"){
                noLactose = true
                console.log("FOUND NO LACTOSE WARE")
            }    
        });   
    }

    // Huvudgruppbenamning används för att avgöra om något är kött 
    var HuvudgruppBenamning = jsonData.Varugrupp.HuvudgruppBenamning
    if( HuvudgruppBenamning.includes("Kött") ||
        HuvudgruppBenamning.includes("Fågel") ||
        HuvudgruppBenamning.includes("Fisk")){
        console.log("FISK FÅGEL MITTEMELLAN")
        vegan = false
        vegetarian = false;
    }

    // Allergener (Kräftdjur / ägg / senap / fisk..)
    var Allergener = jsonData.Allergener

    // TRUE betyder att det finns i varan 
    // Alltså: ägg = true -> varan innehåller ägg
    if(Allergener.length != 0){
        Allergener.forEach(allergen => {
            var Allergenkod = allergen.Allergenkod
            if(Allergenkod === allergenkoder.kraftdjur) kraftdjur = true

            if(Allergenkod === allergenkoder.agg) agg = true
            if(Allergenkod === allergenkoder.senap) senap = true
            if(Allergenkod === allergenkoder.fisk) fish = true
            if(Allergenkod === allergenkoder.blotdjur) blotdjur = true
            if(Allergenkod === allergenkoder.gluten) gluten = true
            if(Allergenkod === allergenkoder.mjolk){ 
                lactose = true
            }
            if(Allergenkod === allergenkoder.notter) notter = true
            if(Allergenkod === allergenkoder.jordnotter) jordnotter = true
            if(Allergenkod === allergenkoder.soja) soja = true
            if(Allergenkod === allergenkoder.svaveldioxid) svaveldioxid = true
            if(Allergenkod === allergenkoder.sesamfro) sesamfro = true

            if(Allergenkod === allergenkoder.agg ||
                Allergenkod === allergenkoder.blotdjur ||
                Allergenkod === allergenkoder.fisk ||
                Allergenkod === allergenkoder.kraftdjur ||
                Allergenkod === allergenkoder.mjolk ){
                vegan = false
            }  
            if( Allergenkod === allergenkoder.blotdjur ||
                Allergenkod === allergenkoder.fisk ||
                Allergenkod === allergenkoder.kraftdjur ){
                vegetarian = false
            }  
        });   
    }

    var obj={
        success: true,
        ingredienser: ingredienser,
        namn: artikelNamn,
        markningar: Markningar,
        Forpackningsstorlek: jsonData.Storlek,
        lank: Lank,
        preferenser: {
            Kräftdjur: kraftdjur, 
            Ägg: agg, 
            Senap: senap, 
            Fisk: fisk, 
            Blötdjur: blotdjur, 
            Gluten: gluten, 
            Laktos: lactose, 
            Nötter: notter, 
            Jordnötter: jordnotter, 
            Soja: soja, 
            Svaveldioxid: svaveldioxid, 
            Sesamfrö: sesamfro, 
            Vegan: vegan,   
            Vegetarian: vegetarian
        }
    }
    return obj
}     
/*
function ingredienser_parser(ingredienser) {
    var split = ingredienser.split(', ')
    var parsed = []
    var currentIngredient = 0
    var inParantheses = false
    var nestedParantheses = false
    for(var i=0; i < split.length; i++){
        var ingredient = split[i]
        if(inParantheses == false){
            parsed.push(ingredient)
        }
        else{
            parsed[parsed.length-1]+= ingredient
        }
        if(ingredient.includes('(')){
            // Start of parantheses
            if(inParantheses == true){
                nestedParantheses = true
            }
            inParantheses = true
        }
        if(ingredient.includes(')')){
            // End of parantheses
            if(nestedParantheses != true){
                inParantheses = false
            }
            else{
                nestedParantheses = false
            }
        }
    }

    parsed[0] = parsed[0].replace("ingredienser: ", "")
    parsed[0] = parsed[0].replace("Ingredienser: ", "")
    parsed[parsed.length-1] = parsed[parsed.length-1].replace("\n", "")
    parsed[parsed.length-1] = parsed[parsed.length-1].replace("\r", "")
    return parsed
}*/

function getImgByGTIN_helper(gtin, callback) {
    const url = ('https://api.dabas.com/DABASService/V2/article/gtin/' + 
        gtin + '/json?apikey=' + 
        process.env.APIKEY);
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            if(data != undefined && data != ""){
                result = JSON.parse(data)

                var imgURL =  "";
                if(result.Bilder.length != 0){
                    imgURL = result.Bilder[0].Lank
                }
                callback(imgURL, result);
            }
            else{
                callback("", null);
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

module.exports = {
    getItemByGTIN: function (gtin,callback) {
        const url = ('https://api.dabas.com/DABASService/V2/article/gtin/' + 
            gtin + '/json?apikey=' + 
            process.env.APIKEY);
        console.log("gtin: " + gtin)
        https.get(url, (resp) => {
            console.log("statusCode: ", resp.statusCode); 
            let data = '';
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                if(data != undefined && data != ""){
                    result = JSON.parse(data)

                    // Callback argument must be a string. Can't be a JSON object
                    var return_object = extractData(result) 
                    callback(return_object);
                }
                else{
                    callback(failure)
                    console.log("data was undefined or empty string")
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            callback(JSON.stringify(failure))
        });
    },


    getFullItemInfoByGTIN: function (gtin,callback) {
        const url = ('https://api.dabas.com/DABASService/V2/article/gtin/' + 
            gtin + '/json?apikey=' + 
            process.env.APIKEY);
        console.log("gtin: " + gtin)
        https.get(url, (resp) => {
            console.log("statusCode: ", resp.statusCode); 
            let data = '';
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                if(data != undefined && data != ""){
                    result = JSON.parse(data)

                    // Callback argument must be a string. Can't be a JSON object
                    callback(JSON.stringify(result));
                }
                else{
                    callback(JSON.stringify(failure))
                    console.log("data was undefined or empty string")
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            callback(JSON.stringify(failure))
        });
    },


    getItemByString: function (search_string,callback) {

        // https://api.dabas.com/DABASService/V2/articles/searchparameter/ketchup/XML?apikey=0c0244c0-8a43-4679-85f7-28bd853fd460
        const url = ('https://api.dabas.com/DABASService/V2/articles/searchparameter/' + 
            search_string + '/json?apikey=' + 
            process.env.APIKEY);
        console.log("search_string: " + search_string)
        https.get(url, (resp) => {
            console.log("statusCode: ", resp.statusCode); 
            let data = '';
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                if(data != undefined && data != ""){
                    jsonData = JSON.parse(data)

                    // JsonData will be an array containing all products that match the search string
                    sliced = jsonData.slice(0, 10)
                    var result = []
                    var lank = ""; 

                    sliced.forEach((product, key, arr) => { 
                        /*console.log(product)
                        result.push({
                            ArtikelNamn: product.Artikelbenamning,
                            Forpackningsstorlek: product.Forpackningsstorlek,
                            Varumarke: product.Varumarke,
                            GTIN: product.GTIN,
                            lank: lank
                        })*/
                        if (cache.isCached(product.GTIN)){
                            val = cache.get(product.GTIN).value;

                            imgURL = "";
                            if(val.Bilder.length != 0){
                                imgURL = val.Bilder[0].Lank
                            }

                            if(val.Konsumentartikel){
                                    result.push({
                                        ArtikelNamn: product.Artikelbenamning,
                                        Forpackningsstorlek: product.Forpackningsstorlek,
                                        Varumarke: product.Varumarke,
                                        GTIN: product.GTIN,
                                        lank: imgURL
                                    });
                            }


                            if (Object.is(arr.length - 1, key)) {
                                callback(JSON.stringify(result))
                            }
                        } else {
                            getImgByGTIN_helper(product.GTIN, function(returnLank, returnValue) {
                                // use the return value here instead of like a regular (non-evented) return value
                                lank = returnLank
                                if(returnValue.Konsumentartikel){
                                    result.push({
                                        ArtikelNamn: product.Artikelbenamning,
                                        Forpackningsstorlek: product.Forpackningsstorlek,
                                        Varumarke: product.Varumarke,
                                        GTIN: product.GTIN,
                                        lank: lank
                                    })
                                }

                                if (Object.is(arr.length - 1, key)) {
                                    callback(JSON.stringify(result))
                                }
                            });
                        } 


                    })
                }
                else{

                    callback(JSON.stringify(failure))
                    console.log("data was undefined or empty string")
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            callback(JSON.stringify(failure))
        });
    },
}
