const express = require("express");
const mongoose = require("mongoose");
var recipeModel = require("./recipe");
const checker = require("./checker");
var productModel = require("./product");
const router = express.Router();
const url = require('url');
var uuid = require('uuid');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        var type = file.originalname.split('.')
        console.log("filename: " + file.originalname)
        console.log("file: " + file)
        cb(null, uuid.v1() + "." + type[1]);

    }
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 1024 } });

router.use(express.json());


// Get recipes from mongoDB
router.get("/recipes", async (request, response) => {
    const recipes = await recipeModel.find({});
    try {
        response.send(recipes).then(result => console.log(result));
    } catch (error) {
        response.status(500).send(error);
    }
});


// Add recipe image to local folder 
router.post("/recipes_image", upload.single('recipeImage'), async (request, response) => {
    console.log(request.file.path)
    var img = request.file.path.replace("uploads/", "")
    response.send(img)
});

// Add recipe to mongoDB 
router.post("/recipes", async (request, response) => {
    
    preferences = JSON.parse(request.body.tags)
    mongodb_tags = []
    
    if (preferences != undefined) {
        for (const [key, value] of Object.entries(preferences)) {
            if (key == "Vegan" && value) {
                mongodb_tags.push("nonvegan")
            }
            else if (key == "Vegetarian" && value) {
                mongodb_tags.push("nonvegetarian")
            }
            else if (value) {
                mongodb_tags.push(key.toLowerCase())
            }
        }
    }
    console.log('Image ' + request.body.recipeImage)
    console.log('Description ' + request.body.description)
    const recipe = new recipeModel({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        description: request.body.description,
        ingredients: request.body.ingredients,
        steps: request.body.steps,
        tags: mongodb_tags,
        portions: request.body.portions,
        recipeImage: request.body.recipeImage
    });
    try {
        await recipe.save();
        console.log(recipe);
        response.send(recipe);
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }

});


// Get recipes from mongoDB
router.get("/get_recipes", async (request, response) => {
    const recipes = await recipeModel.find({});
    try {
        response.send(recipes).then(result => console.log(result));
    } catch (error) {
        response.status(500).send(error);
    }
});


// Add new points to recipe and increment number of reviewers with one in mongoDB
router.post("/recipes/:id", async (request, response) => {
    if(!checker.allowedVoting(request)){
        response.status(429).json({
            success: false,
            error: "You can not vote multiple times" 
        });
	response.send();
        return;
    }

    var id = request.params.id;
    var newPoint = request.query.point;
    const filter = { '_id': id };

    recipeModel.findOneAndUpdate(filter, { $inc: { point: newPoint, reviewers: 1 } }, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
            response.status(500).json({
                success: false,
                error: err
            });
        } else {
            response.status(201).json({
                success: true,
                message: "Handling POST requests to /update_points",
                UpdatedRecipe: doc.name
            });
        }
        //response.send(doc)

    });
});


// This function is for getting a recipe by search id
// Example: of get request http://localhost:3000/get_recipe?id=620cf2c09dbba845f3834bca 
router.get("/recipes/:id", async (request, response) => {
    var id = request.params.id;

    console.log("id" + id);
    recipeModel.findById(id, function (err, doc) {
        if (err) {
            console.log("Something wrong when updating data!");
            response.status(500).json({
                error: err
            });
        }
        console.log(doc)
        response.send(doc)
    });
});



// This function is for getting a recipe by search string and prefrences
router.get("/recipes/search/:search", async (request, response) => {
    var search_str = request.params.search;
    console.log("Search string: " + search_str)
    if (!/^[a-öA-Ö]/.test(search_str)) {
        response.status(422).send({ error: "Bad input" });
        return;
    }
    var preferences = JSON.parse(request.query.tags);
    var mongodb_tags = []
    if (preferences != undefined) {
        for (const [key, value] of Object.entries(preferences)) {
            if (key == "Vegan" && value) {
                mongodb_tags.push("nonvegan")
            }
            else if (key == "Vegetarian" && value) {
                mongodb_tags.push("nonvegetarian")
            }
            else if (value) {
                mongodb_tags.push(key.toLowerCase())
            }
        }
    }
    recipeModel.find({ name: { $regex: search_str }, tags: { $nin: mongodb_tags } }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            
            console.log(docs)
            response.send(docs)

        }
    });

});

// Get a product that has been added in our mongoDB
router.post("/product", async (request, response) => {

    
    console.log(request.body)    
    var preferences = JSON.parse(request.body.allergens)

    const product = new productModel({
        _id: new mongoose.Types.ObjectId(),
        GTIN: request.body.GTIN,
        brand: request.body.brand,
        ingredients: request.body.ingredients,
        name: request.body.name,
        packagesize: request.body.packagesize,
        image: request.body.image,
        allergens: preferences,
        accepted: false
    });
    console.log(product)
    try {
        await product.save();
        response.send(product);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;
