
const { fail } = require('assert');
const { Console } = require('console');
const { json } = require('express');
const https = require("https");
const { ListCollectionsCursor } = require('mongodb');

const not_vegetarian_words = [
    "kyckling",
    "kött",
    "fläsk",
    "gris",
    "skinka",
    "löpe"
]
const not_vegan_words = [
    "smör",
    "mjölk",
    "grädde",
    "laktos",
    "honung",
    "ägg",
    "ost",
]

const allergenkoder = {
    kraftdjur: "en:shellfish",
    agg: "en:eggs",
    senap: "en:mustard",
    fisk: "en:fish",
    blotdjur: "en:molluscs",
    gluten: "en:gluten",
    mjolk: "en:milk",
    notter: "en:nuts",
    jordnotter: "en:peanuts",
    soja: "en:soybeans",
    svaveldioxid: "en:sulfur-dioxide",
    sesamfro: "en:sesame-seeds",
    vegan: "en:vegan"
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
    jsonData = jsonData.product

    if(jsonData == undefined){
        return failure;
    }
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
    var palmoil = false;
    var vegan = true;
    var vegetarian = true;
    

    // Artikelbenamning 
    var artikelNamn = jsonData.product_name

    // Ingrediensforteckning
    var ingredienser = jsonData.ingredients_text
    if(!ingredienser || ingredienser == ""){
        return failure
    }
    not_vegetarian_words.forEach(word => {
        if(ingredienser.includes(word)){
            vegetarian = false
            vegan = false
        }
    })
    not_vegan_words.forEach(word => {
        if(ingredienser.includes(word)) vegan = false
    })
    
    ingredienser = [ingredienser]
    //ingredienser = ingredienser_parser(ingredienser)

    // Länk till bild på produkten
    if(jsonData.image_url !=null){
        var Lank = jsonData.image_url
    }

    
    
    // Huvudgruppbenamning används för att avgöra om något är kött 
    // categories_tags instället? en:meats
    // food_groups_tags istället? en:meat en:fish-meat-eggs en:poultry
    
    var HuvudgruppBenamning = jsonData.ingredients_analysis_tags
    if(HuvudgruppBenamning != undefined && HuvudgruppBenamning.includes("en:non-vegan")){
        vegan = false
    }
    if(HuvudgruppBenamning != undefined && HuvudgruppBenamning.includes("en:non-vegetarian")){
        vegetarian = false;
    }
    
    // Allergener (Kräftdjur / ägg / senap / fisk..)
    var Allergener = jsonData.allergens
    
    // TRUE betyder att det finns i varan 
    // Alltså: ägg = true -> varan innehåller ägg
    if(Allergener.length != 0){
        if(Allergener.includes(allergenkoder.kraftdjur)) kraftdjur = true
        
        if(Allergener.includes(allergenkoder.agg)){
            agg = true
            vegan = false
        } 
        if(Allergener.includes(allergenkoder.senap)) senap = true
        if(Allergener.includes(allergenkoder.fisk)){
            fish = true
            vegan = false
        } 
        if(Allergener.includes(allergenkoder.blotdjur)){
            blotdjur = true
            vegan = false
        } 
        if(Allergener.includes(allergenkoder.gluten)) gluten = true
        if(Allergener.includes(allergenkoder.mjolk)){
            lactose = true
            vegan = false
        } 
        if(Allergener.includes(allergenkoder.notter)) notter = true
        if(Allergener.includes(allergenkoder.jordnotter)) jordnotter = true
        if(Allergener.includes(allergenkoder.soja)) soja = true
        if(Allergener.includes(allergenkoder.svaveldioxid)) svaveldioxid = true
        if(Allergener.includes(allergenkoder.sesamfro)) sesamfro = true
        if(Allergener.includes(allergenkoder.vegan)) vegan = true
        
        if( Allergener.includes(allergenkoder.blotdjur) ||
        Allergener.includes(allergenkoder.fisk) ||
        Allergener.includes(allergenkoder.kraftdjur)){
            vegetarian = false
            vegan = false
        }  
    }   
    

    var obj={
        success: true,
        GTIN: "0"+jsonData._id,
        Varumarke: jsonData.brands,
        ingredienser: ingredienser,
        namn: artikelNamn,
        markningar: null,
        Forpackningsstorlek: jsonData.quantity,
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
    if(ingredienser == undefined){
        return []
    }
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
        console.log("IN OPENFOODFACTS API FILE")
        // open food facts does not want the 0 at the start, remove it
        if(gtin == undefined){
            callback(failure)
        }
        gtin = gtin.slice(1, gtin.length)
        //https://world.openfoodfacts.org/api/v0/product/7318690039808.json
        const url = ('https://se.openfoodfacts.org/api/v0/product/' + gtin + '.json');
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
                    
                jsonData = JSON.parse(data)
                if(jsonData.status_verbose != "product not found"){
                    result = extractData(jsonData)
                    // Callback argument result be a string. Can't be a JSON object
                    //var return_object = extractData(result) 
                    callback(result);
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



    getItemByString: function (search_string,callback) {

        // https://world.openfoodfacts.org/cgi/search.pl?search_terms=vispgr%C3%A4dde&search_simple=0&action=process&json=1
        const url = ('https://se.openfoodfacts.org/cgi/search.pl?search_terms=' + 
            search_string + '&search_simple=0&action=process&json=1');
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
                    result = []
                    if(jsonData.products.length > 0){

                        jsonData.products.forEach(product => {
                            var re_format = {product: product}
                            obj = extractData(re_format)
                            if(obj.success){
                                result.push(obj)
                            }
                        })
                    }
                    callback(result)
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
    
}
