const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const RecipeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    ingredients: {
        type: Array
    },
    steps: {
        type: Array,
    },
    tags: {
        type: Array,
    },
    portions: {
        type: Number
    },
    reviewers: {
        type: Number,
        default: 0
    },
    point: {
        type: Number,
        default: 0
    },
    recipeImage: {
        type: String
    },
});

const recipeModel = mongoose.model("Recipe", RecipeSchema);

module.exports = recipeModel;