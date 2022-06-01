const { Decimal128, Int32 } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProductSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    GTIN: {
        type: Number,
        required: true,
        default: 0
    },
    brand: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    packagesize:  {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    allergens: {
        type: Object,
    },
    accepted: {
        type: Boolean,
        default: false
    }

});

const productModel = mongoose.model("Product", ProductSchema);

module.exports = productModel;